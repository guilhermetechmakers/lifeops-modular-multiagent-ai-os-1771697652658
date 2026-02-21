export interface SettingsPreferences {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  notification_rules?: NotificationRules
  automation_defaults?: AutomationDefaults
  data_retention?: DataRetentionSettings
  developer_settings?: DeveloperSettings
  created_at: string
  updated_at: string
}

export interface NotificationRules {
  email: boolean
  inApp: boolean
  webhook: boolean
  webhookUrl?: string
  eventFilters?: EventFilter[]
}

export interface EventFilter {
  id: string
  event: string
  enabled: boolean
  channels: ('email' | 'inApp' | 'webhook')[]
}

export type AutomationLevel = 'suggest-only' | 'approval-required' | 'auto' | 'bounded-autopilot'

export interface AutomationDefaults {
  [module: string]: AutomationLevel
}

export interface DataRetentionSettings {
  runHistoryDays: number
  exportEnabled: boolean
  lastExportAt?: string
}

export interface DeveloperSettings {
  webhookEndpoints: WebhookEndpoint[]
  sdkTokens: SdkToken[]
  sandboxMode: boolean
}

export interface WebhookEndpoint {
  id: string
  url: string
  secret?: string
  enabled: boolean
  events: string[]
}

export interface SdkToken {
  id: string
  name: string
  prefix: string
  lastUsedAt?: string
  createdAt: string
}
