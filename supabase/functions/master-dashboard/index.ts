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
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      userId = user?.id
    }

    if (req.method === 'GET' || req.method === 'POST') {
      const overview = {
        activeAgents: 4,
        runningWorkflows: 2,
        pendingApprovals: 5,
        nextScheduledRuns: 3,
        trends: {
          activeAgents: { value: 4, change: 1, changePercent: 33, previousPeriod: 'vs last week' },
          runningWorkflows: { value: 2, change: 0, changePercent: 0, previousPeriod: 'vs last week' },
          pendingApprovals: { value: 5, change: -2, changePercent: -29, previousPeriod: 'vs last week' },
          nextScheduledRuns: { value: 3, change: 1, changePercent: 50, previousPeriod: 'vs last week' },
        },
        sparklines: {
          activeAgents: [2, 3, 3, 4, 3, 4, 4],
          runningWorkflows: [1, 2, 1, 2, 2, 1, 2],
          pendingApprovals: [7, 6, 5, 6, 5, 5, 5],
          nextScheduledRuns: [2, 2, 3, 2, 3, 3, 3],
        },
      }

      const cronjobs = [
        { id: '1', name: 'PR Triage', schedule: '0 2 * * *', nextRun: '2:00 AM', lastOutcome: 'success' as const, enabled: true },
        { id: '2', name: 'Weekly Digest', schedule: '0 9 * * 1', nextRun: 'Mon 9:00 AM', lastOutcome: 'success' as const, enabled: true },
        { id: '3', name: 'Monthly Close', schedule: '0 0 1 * *', nextRun: '1st 12:00 AM', lastOutcome: 'failed' as const, enabled: false },
      ]

      const activeRuns = [
        { id: '1', name: 'PR Triage', status: 'running' as const, progress: 65, logsPeek: 'Processing PR #234...', startedAt: new Date().toISOString() },
        { id: '2', name: 'Weekly Digest', status: 'running' as const, progress: 30, logsPeek: 'Aggregating metrics...', startedAt: new Date().toISOString() },
      ]

      const alerts = [
        { id: '1', message: 'Cronjob "Monthly Close" failed', severity: 'high' as const, type: 'cronjob_failed' as const, createdAt: new Date().toISOString() },
        { id: '2', message: 'Connector GitHub token expiring', severity: 'medium' as const, type: 'connector_expiring' as const, createdAt: new Date().toISOString() },
      ]

      const auditSnapshot = [
        { id: '1', action: 'Approved PR merge', entity: 'PR #234', timestamp: new Date().toISOString(), userId },
        { id: '2', action: 'Created Cronjob', entity: 'Weekly Digest', timestamp: new Date().toISOString(), userId },
      ]

      const payload = {
        overview,
        cronjobs,
        activeRuns,
        alerts,
        auditSnapshot,
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
