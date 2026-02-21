export interface MasterDashboard {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface MetricTrend {
  value: number
  change: number
  changePercent: number
  previousPeriod: string
}

export interface SystemOverviewData {
  activeAgents: number
  runningWorkflows: number
  pendingApprovals: number
  nextScheduledRuns: number
  trends?: {
    activeAgents?: MetricTrend
    runningWorkflows?: MetricTrend
    pendingApprovals?: MetricTrend
    nextScheduledRuns?: MetricTrend
  }
  sparklines?: {
    activeAgents?: number[]
    runningWorkflows?: number[]
    pendingApprovals?: number[]
    nextScheduledRuns?: number[]
  }
}

export interface CronjobItem {
  id: string
  name: string
  schedule: string
  nextRun: string
  lastOutcome: 'success' | 'failed' | 'pending'
  enabled: boolean
}

export interface ActiveRun {
  id: string
  name: string
  status: 'running' | 'pending_approval' | 'completed' | 'failed'
  progress?: number
  logsPeek?: string
  startedAt: string
  /** CI/CD provider when run is linked to external pipeline */
  cicdProvider?: 'circleci' | 'jenkins' | 'github_actions'
  /** External CI run ID for status/retry/artifacts */
  cicdRunId?: string
}

export interface AlertItem {
  id: string
  message: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  type: 'cronjob_failed' | 'agent_conflict' | 'connector_expiring' | 'other'
  createdAt: string
}

export interface AuditItem {
  id: string
  action: string
  entity: string
  timestamp: string
  userId?: string
}

export interface UserDashboardConfig {
  id: string
  title: string
  description?: string
  status: string
}

export interface MasterDashboardPayload {
  overview: SystemOverviewData
  cronjobs: CronjobItem[]
  activeRuns: ActiveRun[]
  alerts: AlertItem[]
  auditSnapshot: AuditItem[]
  userDashboards?: UserDashboardConfig[]
}
