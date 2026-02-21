export interface ModuleDashboardProject {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface ProjectMetrics {
  openTickets: number
  ciFailures: number
  activePRs: number
}

export interface OrganizationProject {
  id: string
  name: string
  metrics: ProjectMetrics
  status: 'active' | 'archived'
}

export interface Milestone {
  id: string
  title: string
  dueDate: string
  status: 'planned' | 'in-progress' | 'completed'
  tasks: MilestoneTask[]
}

export interface MilestoneTask {
  id: string
  title: string
  status: 'todo' | 'in-progress' | 'done'
  agentSuggested?: boolean
}

export interface Ticket {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high'
  agentSuggested?: boolean
  projectId?: string
}

export interface PR {
  id: string
  title: string
  branch: string
  status: 'open' | 'merged' | 'closed'
  linkedTicketIds: string[]
}

export interface Integration {
  id: string
  type: 'github' | 'gitlab'
  name: string
  connected: boolean
  lastSync?: string
}

export interface ModuleDashboardProjectsPayload {
  projects: OrganizationProject[]
  milestones: Milestone[]
  tickets: Ticket[]
  prs: PR[]
  integrations: Integration[]
}
