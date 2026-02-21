/** Run Details & Artifacts - DB entity */
export interface RunDetailsArtifacts {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

/** Run summary: status, times, initiator, cost */
export interface RunSummaryData {
  id: string
  status: 'running' | 'completed' | 'failed' | 'pending_approval'
  startedAt: string
  endedAt?: string
  initiator: 'cron' | 'manual'
  costEstimate?: number
  consumedCredits?: number
  name: string
}

/** Agent message in trace */
export interface AgentMessage {
  id: string
  fromAgent: string
  toAgent: string
  content: string
  timestamp: string
  type: 'handoff' | 'consensus' | 'standard'
}

/** Action diff for modified resource */
export interface ActionDiff {
  id: string
  resourceType: 'code' | 'docs' | 'ledger'
  resourcePath: string
  beforeContent: string
  afterContent: string
  addedLines: number
  removedLines: number
}

/** Artifact: file, PR, content, report */
export interface Artifact {
  id: string
  type: 'file' | 'pr' | 'content' | 'report'
  name: string
  url?: string
  downloadUrl?: string
  createdAt: string
}

/** Full run details payload from Edge Function */
export interface RunDetailsArtifactsPayload {
  summary: RunSummaryData
  messages: AgentMessage[]
  diffs: ActionDiff[]
  artifacts: Artifact[]
  canRollback: boolean
}
