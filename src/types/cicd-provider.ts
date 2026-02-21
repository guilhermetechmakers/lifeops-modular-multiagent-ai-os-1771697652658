export type CicdProvider = 'circleci' | 'jenkins' | 'github_actions'

export interface CicdTriggerPayload {
  provider: CicdProvider
  pipelineId?: string
  branch?: string
  workflowId?: string
  jobName?: string
  parameters?: Record<string, string>
}

export interface CicdStatusPayload {
  provider: CicdProvider
  runId: string
}

export interface CicdArtifactsPayload {
  provider: CicdProvider
  runId: string
}

export interface CicdRetryPayload {
  provider: CicdProvider
  runId: string
}

export interface CicdCredentialsPayload {
  provider: CicdProvider
  credentials?: {
    token?: string
    apiKey?: string
    baseUrl?: string
    username?: string
  }
}

export interface CicdCredentialRecord {
  id: string
  provider: CicdProvider
  created_at: string
}

export interface CicdRunStatus {
  id: string
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled' | 'unknown'
  provider: CicdProvider
  workflow?: string
  branch?: string
  startedAt?: string
  finishedAt?: string
  message?: string
}

export interface CicdArtifact {
  id: string
  name: string
  size?: number
  url?: string
  expiresAt?: string
}
