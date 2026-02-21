import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

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

    const url = new URL(req.url)
    let runId = url.searchParams.get('runId') ?? req.headers.get('x-run-id')
    let body: { runId?: string; action?: string } = {}
    if (req.method === 'POST') {
      body = await req.json().catch(() => ({}))
      runId = body?.runId ?? runId
    }

    if (!runId) {
      return new Response(
        JSON.stringify({ error: 'runId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'GET' || (req.method === 'POST' && !body.action)) {
      // Build mock payload for run details (server-side only)
      const summary = {
        id: runId,
        status: 'running' as const,
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        endedAt: undefined as string | undefined,
        initiator: 'cron' as const,
        costEstimate: 0.042,
        consumedCredits: 0.038,
        name: 'PR Triage',
      }

      const messages = [
        {
          id: '1',
          fromAgent: 'PR Triage',
          toAgent: 'Code Reviewer',
          content: 'PR #234 ready for review. Changes in src/utils.ts',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          type: 'handoff' as const,
        },
        {
          id: '2',
          fromAgent: 'Code Reviewer',
          toAgent: 'PR Triage',
          content: 'Approved with minor suggestions',
          timestamp: new Date(Date.now() - 2400000).toISOString(),
          type: 'consensus' as const,
        },
        {
          id: '3',
          fromAgent: 'PR Triage',
          toAgent: 'Merge Agent',
          content: 'Merge approved. Proceed with merge.',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          type: 'handoff' as const,
        },
      ]

      const diffs = [
        {
          id: '1',
          resourceType: 'code' as const,
          resourcePath: 'src/utils/format.ts',
          beforeContent: 'export function formatDate(d: Date) {\n  return d.toISOString()\n}',
          afterContent: 'export function formatDate(d: Date) {\n  return d.toLocaleDateString()\n}',
          addedLines: 1,
          removedLines: 1,
        },
      ]

      const artifacts = [
        {
          id: '1',
          type: 'pr' as const,
          name: 'PR #234',
          url: 'https://github.com/org/repo/pull/234',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'file' as const,
          name: 'report.pdf',
          downloadUrl: '/api/artifacts/report.pdf',
          createdAt: new Date().toISOString(),
        },
      ]

      const payload = {
        summary,
        messages,
        diffs,
        artifacts,
        canRollback: true,
      }

      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'POST' && body.action) {
      const action = body.action

      if (action === 'rollback-preview') {
        return new Response(
          JSON.stringify({
            preview: {
              affectedResources: ['src/utils/format.ts'],
              steps: ['Revert formatDate change', 'Update PR status'],
            },
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (action === 'rollback') {
        return new Response(
          JSON.stringify({ success: true, message: 'Rollback initiated' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
