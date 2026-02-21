export interface DocsHelp {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface DocsSearchResult {
  id: string
  type: 'guide' | 'api' | 'sdk' | 'troubleshooting'
  title: string
  description?: string
  href: string
  category: string
}

export interface Tutorial {
  id: string
  title: string
  description: string
  category: 'cronjob' | 'workflow' | 'agent' | 'integration'
  href: string
  duration?: string
}

export interface ChangelogEntry {
  id: string
  version: string
  date: string
  title: string
  changes: string[]
}

export interface SystemStatus {
  service: string
  status: 'operational' | 'degraded' | 'outage'
  message?: string
}

export interface SupportTicketRequest {
  subject: string
  description: string
  priority: 'low' | 'medium' | 'high'
}
