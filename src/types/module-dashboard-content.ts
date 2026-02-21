export interface ModuleDashboardContent {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface ContentIdea {
  id: string
  title: string
  outline?: string
  priorityScore: number
  status: 'new' | 'outlined' | 'drafting' | 'scheduled' | 'published'
  createdAt: string
  agentSuggested?: boolean
}

export interface CalendarSlot {
  id: string
  date: string
  time?: string
  contentId?: string
  title?: string
  platform?: 'wordpress' | 'contentful' | 'twitter' | 'linkedin' | 'newsletter'
  status: 'empty' | 'scheduled' | 'published'
}

export interface DraftVersion {
  id: string
  contentId: string
  version: number
  content: string
  seoScore?: number
  createdAt: string
}

export interface ConnectorStatus {
  id: string
  type: 'wordpress' | 'contentful' | 'twitter' | 'linkedin' | 'newsletter'
  name: string
  connected: boolean
  lastSync?: string
  health: 'healthy' | 'degraded' | 'error'
}

export interface PostPerformance {
  id: string
  title: string
  platform: string
  publishedAt: string
  impressions?: number
  engagement?: number
  clicks?: number
  feedback?: string
}

export interface ModuleDashboardContentPayload {
  ideas: ContentIdea[]
  calendarSlots: CalendarSlot[]
  drafts: DraftVersion[]
  connectors: ConnectorStatus[]
  performance: PostPerformance[]
  metrics: {
    drafts: number
    scheduled: number
    ideaInbox: number
    published: number
  }
}
