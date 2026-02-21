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

    if (req.method === 'GET' || req.method === 'POST') {
      const projects = [
        {
          id: '1',
          name: 'LifeOps Core',
          metrics: { openTickets: 12, ciFailures: 2, activePRs: 5 },
          status: 'active' as const,
        },
        {
          id: '2',
          name: 'Content Pipeline',
          metrics: { openTickets: 8, ciFailures: 0, activePRs: 3 },
          status: 'active' as const,
        },
        {
          id: '3',
          name: 'Agent Framework',
          metrics: { openTickets: 24, ciFailures: 1, activePRs: 7 },
          status: 'active' as const,
        },
      ]

      const milestones = [
        {
          id: '1',
          title: 'Q1 Release',
          dueDate: '2025-03-31',
          status: 'in-progress' as const,
          tasks: [
            { id: 't1', title: 'Auth refactor', status: 'done' as const, agentSuggested: false },
            { id: 't2', title: 'Dashboard v2', status: 'in-progress' as const, agentSuggested: true },
            { id: 't3', title: 'API docs', status: 'todo' as const, agentSuggested: true },
          ],
        },
        {
          id: '2',
          title: 'Q2 Planning',
          dueDate: '2025-06-30',
          status: 'planned' as const,
          tasks: [
            { id: 't4', title: 'Multi-tenant support', status: 'todo' as const, agentSuggested: true },
          ],
        },
      ]

      const tickets = [
        { id: '1', title: 'Fix auth flow', status: 'in-progress' as const, priority: 'high' as const, agentSuggested: false, projectId: '1' },
        { id: '2', title: 'Add API docs', status: 'todo' as const, priority: 'medium' as const, agentSuggested: true, projectId: '1' },
        { id: '3', title: 'Refactor dashboard', status: 'done' as const, priority: 'low' as const, agentSuggested: false, projectId: '1' },
        { id: '4', title: 'Improve error handling', status: 'review' as const, priority: 'high' as const, agentSuggested: true, projectId: '2' },
      ]

      const prs = [
        { id: '1', title: 'feat: Add module dashboard', branch: 'feat/module-dashboard', status: 'open' as const, linkedTicketIds: ['1', '2'] },
        { id: '2', title: 'fix: Auth token refresh', branch: 'fix/auth-refresh', status: 'merged' as const, linkedTicketIds: ['1'] },
      ]

      const integrations = [
        { id: '1', type: 'github' as const, name: 'lifeops/main', connected: true, lastSync: new Date().toISOString() },
        { id: '2', type: 'gitlab' as const, name: 'internal/backend', connected: false },
      ]

      const payload = {
        projects,
        milestones,
        tickets,
        prs,
        integrations,
      }

      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
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
