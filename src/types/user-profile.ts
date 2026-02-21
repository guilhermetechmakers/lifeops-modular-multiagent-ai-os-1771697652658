export interface UserProfile {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  profile_info?: ProfileInfo
  connections?: Connection[]
  api_keys?: ApiKey[]
  agent_presets?: AgentPresets
  security_settings?: SecuritySettings
  created_at: string
  updated_at: string
}

export interface ProfileInfo {
  name: string
  email: string
  avatar_url?: string
  timezone: string
  language: string
}

export interface Connection {
  id: string
  service: string
  status: 'connected' | 'disconnected' | 'error'
  health?: 'healthy' | 'degraded' | 'unhealthy'
  connected_at?: string
  metadata?: Record<string, unknown>
}

export interface ApiKey {
  id: string
  name: string
  prefix: string
  scope: string[]
  last_used_at?: string
  created_at: string
  usage_count?: number
}

export interface AgentPresets {
  default_behavior?: string
  memory_scope?: 'session' | 'project' | 'global'
  temperature?: number
  max_tokens?: number
}

export interface SecuritySettings {
  two_fa_enabled: boolean
  sessions?: Session[]
  last_activity?: string
}

export interface Session {
  id: string
  device?: string
  location?: string
  last_active: string
  current?: boolean
}

export interface ActivityLogEntry {
  id: string
  action: string
  timestamp: string
  details?: string
}
