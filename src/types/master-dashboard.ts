export interface MasterDashboard {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface SystemOverviewData {
  activeAgents: number
  runningWorkflows: number
  pendingApprovals: number
  nextScheduledRuns: number
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

export interface MasterDashboardPayload {
  overview: SystemOverviewData
  cronjobs: CronjobItem[]
  activeRuns: ActiveRun[]
  alerts: AlertItem[]
  auditSnapshot: AuditItem[]
}
