export interface AgentDirectory {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface AgentDirectoryItem extends AgentDirectory {
  module?: string
  owner?: string
  tags?: string[]
  lastRun?: string
  lastRunId?: string
  health?: 'healthy' | 'degraded' | 'unhealthy' | 'unknown'
  connectors?: string[]
}

export interface AgentDetails extends AgentDirectoryItem {
  purpose?: string
  capabilities?: string[]
  memoryScope?: string
  permissions?: string[]
  runHistory?: RunHistoryItem[]
}

export interface RunHistoryItem {
  id: string
  runId: string
  status: 'success' | 'failed' | 'running' | 'pending'
  startedAt: string
  completedAt?: string
  duration?: number
}

export interface AgentTemplate {
  id: string
  name: string
  description?: string
  category?: string
}

export interface CreateAgentPayload {
  title: string
  description?: string
  templateId?: string
  prompt?: string
  tools?: string[]
}
