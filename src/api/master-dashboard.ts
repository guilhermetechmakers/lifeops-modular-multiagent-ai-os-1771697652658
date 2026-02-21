import { supabase } from '@/lib/supabase'
import type { MasterDashboardPayload } from '@/types/master-dashboard'

const MOCK_PAYLOAD: MasterDashboardPayload = {
  overview: {
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
  },
  cronjobs: [
    { id: '1', name: 'PR Triage', schedule: '0 2 * * *', nextRun: '2:00 AM', lastOutcome: 'success', enabled: true },
    { id: '2', name: 'Weekly Digest', schedule: '0 9 * * 1', nextRun: 'Mon 9:00 AM', lastOutcome: 'success', enabled: true },
    { id: '3', name: 'Monthly Close', schedule: '0 0 1 * *', nextRun: '1st 12:00 AM', lastOutcome: 'failed', enabled: false },
  ],
  activeRuns: [
    { id: '1', name: 'PR Triage', status: 'running', progress: 65, logsPeek: 'Processing PR #234...', startedAt: new Date().toISOString() },
    { id: '2', name: 'Weekly Digest', status: 'running', progress: 30, logsPeek: 'Aggregating metrics...', startedAt: new Date().toISOString() },
  ],
  alerts: [
    { id: '1', message: 'Cronjob "Monthly Close" failed', severity: 'high', type: 'cronjob_failed', createdAt: new Date().toISOString() },
    { id: '2', message: 'Connector GitHub token expiring', severity: 'medium', type: 'connector_expiring', createdAt: new Date().toISOString() },
  ],
  auditSnapshot: [
    { id: '1', action: 'Approved PR merge', entity: 'PR #234', timestamp: new Date().toISOString() },
    { id: '2', action: 'Created Cronjob', entity: 'Weekly Digest', timestamp: new Date().toISOString() },
  ],
}

export async function fetchMasterDashboard(): Promise<MasterDashboardPayload> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<MasterDashboardPayload>('master-dashboard', {
      method: 'POST',
    })
    if (!error && data) return data
  }
  return MOCK_PAYLOAD
}
