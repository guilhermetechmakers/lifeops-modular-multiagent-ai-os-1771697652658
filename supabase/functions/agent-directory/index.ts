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

    const mockAgents = [
      {
        id: '1',
        user_id: userId ?? 'user-1',
        title: 'PR Triage Agent',
        description: 'Automatically triages and categorizes pull requests',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        module: 'Projects',
        owner: 'System',
        tags: ['GitHub', 'CI', 'automation'],
        lastRun: new Date(Date.now() - 3600000).toISOString(),
        health: 'healthy' as const,
        connectors: ['GitHub', 'CI'],
      },
      {
        id: '2',
        user_id: userId ?? 'user-1',
        title: 'Content Outliner',
        description: 'Generates content outlines from briefs',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        module: 'Content',
        owner: 'System',
        tags: ['CMS', 'content'],
        lastRun: new Date(Date.now() - 7200000).toISOString(),
        health: 'healthy' as const,
        connectors: ['CMS'],
      },
      {
        id: '3',
        user_id: userId ?? 'user-1',
        title: 'Finance Categorizer',
        description: 'Categorizes transactions and reconciles accounts',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        module: 'Finance',
        owner: 'User',
        tags: ['Plaid', 'finance'],
        lastRun: new Date(Date.now() - 86400000).toISOString(),
        health: 'degraded' as const,
        connectors: ['Plaid'],
      },
      {
        id: '4',
        user_id: userId ?? 'user-1',
        title: 'Training Planner',
        description: 'Creates personalized training plans',
        status: 'idle',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        module: 'Health',
        owner: 'User',
        tags: ['Calendar', 'health'],
        lastRun: undefined,
        health: 'unknown' as const,
        connectors: ['Calendar'],
      },
    ]

    let body: Record<string, unknown> = {}
    try {
      body = (await req.json()) as Record<string, unknown>
    } catch {
      // Empty body for GET
    }

    const action = body.action as string | undefined

    if (req.method === 'GET' || action === 'list' || !action) {
      const module = (body.module as string) ?? (body.filters as Record<string, string>)?.module
      const status = (body.status as string) ?? (body.filters as Record<string, string>)?.status
      const owner = (body.owner as string) ?? (body.filters as Record<string, string>)?.owner
      const tags = (body.tags as string[]) ?? (body.filters as Record<string, string[]>)?.tags

      let filtered = [...mockAgents]
      if (module) filtered = filtered.filter((a) => a.module === module)
      if (status) filtered = filtered.filter((a) => a.status === status)
      if (owner) filtered = filtered.filter((a) => a.owner === owner)
      if (tags?.length)
        filtered = filtered.filter((a) => tags.some((t) => a.tags?.includes(t)))

      return new Response(JSON.stringify(filtered), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'get' && body.id) {
      const agentId = body.id as string
      const agent = mockAgents.find((a) => a.id === agentId) ?? mockAgents[0]
      const details = {
        ...agent,
        purpose: agent.description,
        capabilities: ['Analyze', 'Categorize', 'Report'],
        memoryScope: 'Session',
        permissions: ['read', 'write'],
        runHistory: [
          {
            id: 'r1',
            runId: 'run-1',
            status: 'success' as const,
            startedAt: new Date(Date.now() - 3600000).toISOString(),
            completedAt: new Date(Date.now() - 3500000).toISOString(),
            duration: 100,
          },
        ],
      }
      return new Response(JSON.stringify(details), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'create' && body.title) {
      const newAgent = {
        id: crypto.randomUUID(),
        user_id: userId ?? 'user-1',
        title: body.title as string,
        description: (body.description as string) ?? '',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return new Response(JSON.stringify(newAgent), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'clone' && body.id) {
      const source = mockAgents.find((a) => a.id === body.id) ?? mockAgents[0]
      const cloned = {
        ...source,
        id: crypto.randomUUID(),
        title: `Copy of ${source.title}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return new Response(JSON.stringify(cloned), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'updateStatus' && body.id && body.status) {
      return new Response(
        JSON.stringify({ id: body.id, status: body.status }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (action === 'archive' && body.id) {
      return new Response(
        JSON.stringify({ deleted: body.id }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Internal server error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
