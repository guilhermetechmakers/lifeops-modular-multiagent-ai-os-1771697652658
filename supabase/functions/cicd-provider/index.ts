import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

export type CicdProvider = 'circleci' | 'jenkins' | 'github_actions'

interface TriggerPayload {
  provider: CicdProvider
  pipelineId?: string
  branch?: string
  workflowId?: string
  jobName?: string
  parameters?: Record<string, string>
}

interface StatusPayload {
  provider: CicdProvider
  runId: string
}

interface ArtifactsPayload {
  provider: CicdProvider
  runId: string
}

interface RetryPayload {
  provider: CicdProvider
  runId: string
}

interface CredentialsPayload {
  provider: CicdProvider
  credentials?: {
    token?: string
    apiKey?: string
    baseUrl?: string
    username?: string
  }
}

interface CicdRequest {
  action: 'trigger' | 'status' | 'artifacts' | 'retry' | 'credentials_list' | 'credentials_save' | 'credentials_delete'
  payload?: TriggerPayload | StatusPayload | ArtifactsPayload | RetryPayload | CredentialsPayload
}

async function getCredentials(supabase: ReturnType<typeof createClient>, userId: string, provider: CicdProvider) {
  const { data, error } = await supabase
    .from('cicd_provider_credentials')
    .select('encrypted_credentials')
    .eq('user_id', userId)
    .eq('provider', provider)
    .single()
  if (error || !data) return null
  try {
    return JSON.parse(data.encrypted_credentials) as Record<string, string>
  } catch {
    return null
  }
}

async function callProviderApi(
  provider: CicdProvider,
  credentials: Record<string, string> | null,
  endpoint: string,
  options: RequestInit = {}
): Promise<unknown> {
  if (!credentials) {
    return { error: 'No credentials configured for provider' }
  }
  const baseUrls: Record<CicdProvider, string> = {
    circleci: credentials.baseUrl ?? 'https://circleci.com/api/v2',
    jenkins: credentials.baseUrl ?? '',
    github_actions: 'https://api.github.com',
  }
  const url = baseUrls[provider] ? `${baseUrls[provider]}${endpoint}` : endpoint
  const token = credentials.token ?? credentials.apiKey
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    if (provider === 'github_actions') {
      headers['Authorization'] = `Bearer ${token}`
    } else {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  const res = await fetch(url, { ...options, headers })
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text, status: res.status }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const corsJson = { ...corsHeaders, 'Content-Type': 'application/json' }

  try {
    const authHeader = req.headers.get('Authorization')
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    })

    let userId: string | undefined
    if (authHeader) {
      const {
        data: { user },
      } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      userId = user?.id
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: corsJson }
      )
    }

    let body: CicdRequest
    try {
      body = (await req.json()) as CicdRequest
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: corsJson }
      )
    }

    const { action, payload } = body

    switch (action) {
      case 'trigger': {
        const p = payload as TriggerPayload
        if (!p?.provider) {
          return new Response(
            JSON.stringify({ error: 'provider required' }),
            { status: 400, headers: corsJson }
          )
        }
        const creds = await getCredentials(supabase, userId, p.provider)
        if (p.provider === 'circleci') {
          const projectSlug = p.pipelineId ?? 'gh/owner/repo'
          const res = await callProviderApi(
            p.provider,
            creds,
            `/project/${projectSlug}/pipeline`,
            {
              method: 'POST',
              body: JSON.stringify({
                branch: p.branch ?? 'main',
                parameters: p.parameters ?? {},
              }),
            }
          )
          return new Response(JSON.stringify(res), { status: 200, headers: corsJson })
        }
        if (p.provider === 'github_actions') {
          const [owner, repo] = (p.pipelineId ?? 'owner/repo').split('/')
          const res = await callProviderApi(
            p.provider,
            creds,
            `/repos/${owner}/${repo}/actions/workflows/${p.workflowId ?? 'ci.yml'}/dispatches`,
            {
              method: 'POST',
              body: JSON.stringify({
                ref: p.branch ?? 'main',
                inputs: p.parameters ?? {},
              }),
            }
          )
          return new Response(JSON.stringify(res), { status: 200, headers: corsJson })
        }
        if (p.provider === 'jenkins') {
          const jobPath = p.pipelineId ?? 'job/my-job'
          const res = await callProviderApi(
            p.provider,
            creds,
            `${creds?.baseUrl ?? ''}/job/${jobPath}/build`,
            {
              method: 'POST',
              body: JSON.stringify(p.parameters ?? {}),
            }
          )
          return new Response(JSON.stringify(res), { status: 200, headers: corsJson })
        }
        return new Response(
          JSON.stringify({ error: 'Unsupported provider' }),
          { status: 400, headers: corsJson }
        )
      }

      case 'status': {
        const p = payload as StatusPayload
        if (!p?.provider || !p?.runId) {
          return new Response(
            JSON.stringify({ error: 'provider and runId required' }),
            { status: 400, headers: corsJson }
          )
        }
        const creds = await getCredentials(supabase, userId, p.provider)
        if (p.provider === 'circleci') {
          const res = await callProviderApi(
            p.provider,
            creds,
            `/pipeline/${p.runId}/workflow`
          )
          return new Response(JSON.stringify(res), { status: 200, headers: corsJson })
        }
        if (p.provider === 'github_actions') {
          const [owner, repo, runId] = p.runId.split('/')
          const path = runId
            ? `/repos/${owner}/${repo}/actions/runs/${runId}`
            : `/repos/${owner}/${repo}/actions/runs/${p.runId}`
          const res = await callProviderApi(p.provider, creds, path)
          return new Response(JSON.stringify(res), { status: 200, headers: corsJson })
        }
        return new Response(
          JSON.stringify({
            id: p.runId,
            status: 'unknown',
            provider: p.provider,
            message: 'Status check requires provider-specific implementation',
          }),
          { status: 200, headers: corsJson }
        )
      }

      case 'artifacts': {
        const p = payload as ArtifactsPayload
        if (!p?.provider || !p?.runId) {
          return new Response(
            JSON.stringify({ error: 'provider and runId required' }),
            { status: 400, headers: corsJson }
          )
        }
        const creds = await getCredentials(supabase, userId, p.provider)
        if (p.provider === 'github_actions') {
          const parts = p.runId.split('/')
          const runId = parts[parts.length - 1]
          const owner = parts[0]
          const repo = parts[1]
          const res = await callProviderApi(
            p.provider,
            creds,
            `/repos/${owner}/${repo}/actions/runs/${runId}/artifacts`
          )
          return new Response(JSON.stringify(res), { status: 200, headers: corsJson })
        }
        return new Response(
          JSON.stringify({
            artifacts: [],
            message: 'Artifacts endpoint requires provider-specific implementation',
          }),
          { status: 200, headers: corsJson }
        )
      }

      case 'retry': {
        const p = payload as RetryPayload
        if (!p?.provider || !p?.runId) {
          return new Response(
            JSON.stringify({ error: 'provider and runId required' }),
            { status: 400, headers: corsJson }
          )
        }
        const creds = await getCredentials(supabase, userId, p.provider)
        if (p.provider === 'github_actions') {
          const parts = p.runId.split('/')
          const runId = parts[parts.length - 1]
          const owner = parts[0]
          const repo = parts[1]
          const res = await callProviderApi(
            p.provider,
            creds,
            `/repos/${owner}/${repo}/actions/runs/${runId}/rerun`,
            { method: 'POST' }
          )
          return new Response(JSON.stringify(res), { status: 200, headers: corsJson })
        }
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Retry requested. Provider-specific retry may require manual trigger.',
          }),
          { status: 200, headers: corsJson }
        )
      }

      case 'credentials_list': {
        const p = payload as { provider?: CicdProvider }
        const query = supabase
          .from('cicd_provider_credentials')
          .select('id, provider, created_at')
          .eq('user_id', userId)
        if (p?.provider) query.eq('provider', p.provider)
        const { data, error } = await query
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: corsJson }
          )
        }
        return new Response(
          JSON.stringify({ credentials: data ?? [] }),
          { status: 200, headers: corsJson }
        )
      }

      case 'credentials_save': {
        const p = payload as CredentialsPayload
        if (!p?.provider || !p?.credentials) {
          return new Response(
            JSON.stringify({ error: 'provider and credentials required' }),
            { status: 400, headers: corsJson }
          )
        }
        const enc = JSON.stringify(p.credentials)
        const { data: existing } = await supabase
          .from('cicd_provider_credentials')
          .select('id')
          .eq('user_id', userId)
          .eq('provider', p.provider)
          .single()

        const row = {
          user_id: userId,
          provider: p.provider,
          encrypted_credentials: enc,
          updated_at: new Date().toISOString(),
        }

        const { data, error } = existing
          ? await supabase
              .from('cicd_provider_credentials')
              .update(row)
              .eq('id', existing.id)
              .select('id, provider')
              .single()
          : await supabase
              .from('cicd_provider_credentials')
              .insert(row)
              .select('id, provider')
              .single()
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: corsJson }
          )
        }
        return new Response(
          JSON.stringify({ success: true, credential: data }),
          { status: 200, headers: corsJson }
        )
      }

      case 'credentials_delete': {
        const p = payload as CredentialsPayload
        if (!p?.provider) {
          return new Response(
            JSON.stringify({ error: 'provider required' }),
            { status: 400, headers: corsJson }
          )
        }
        const { error } = await supabase
          .from('cicd_provider_credentials')
          .delete()
          .eq('user_id', userId)
          .eq('provider', p.provider)
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: corsJson }
          )
        }
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: corsJson }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: corsJson }
        )
    }
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Internal server error',
      }),
      { status: 500, headers: corsJson }
    )
  }
})
