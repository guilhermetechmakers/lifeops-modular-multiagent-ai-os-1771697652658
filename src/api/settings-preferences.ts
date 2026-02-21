import { supabase } from '@/lib/supabase'
import type {
  SettingsPreferences,
  NotificationRules,
  AutomationDefaults,
  DataRetentionSettings,
  DeveloperSettings,
} from '@/types/settings-preferences'

const DEFAULT_SETTINGS: SettingsPreferences = {
  id: '',
  user_id: '',
  title: 'Settings & Preferences',
  status: 'active',
  notification_rules: {
    email: true,
    inApp: true,
    webhook: false,
    eventFilters: [],
  },
  automation_defaults: {},
  data_retention: { runHistoryDays: 90, exportEnabled: true },
  developer_settings: {
    webhookEndpoints: [],
    sdkTokens: [],
    sandboxMode: false,
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export async function fetchSettingsPreferences(): Promise<SettingsPreferences> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<SettingsPreferences>(
      'settings-preferences',
      { body: { action: 'get' } }
    )
    if (!error && data) return data
  }
  return { ...DEFAULT_SETTINGS, id: 'mock', user_id: 'mock' }
}

export async function updateNotificationRules(
  rules: NotificationRules
): Promise<SettingsPreferences> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<SettingsPreferences>(
      'settings-preferences',
      {
        body: { action: 'update', notification_rules: rules },
      }
    )
    if (!error && data) return data
  }
  return { ...DEFAULT_SETTINGS, notification_rules: rules } as SettingsPreferences
}

export async function updateAutomationDefaults(
  defaults: AutomationDefaults
): Promise<SettingsPreferences> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<SettingsPreferences>(
      'settings-preferences',
      {
        body: { action: 'update', automation_defaults: defaults },
      }
    )
    if (!error && data) return data
  }
  return { ...DEFAULT_SETTINGS, automation_defaults: defaults } as SettingsPreferences
}

export async function updateDataRetention(
  retention: DataRetentionSettings
): Promise<SettingsPreferences> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<SettingsPreferences>(
      'settings-preferences',
      {
        body: { action: 'update', data_retention: retention },
      }
    )
    if (!error && data) return data
  }
  return { ...DEFAULT_SETTINGS, data_retention: retention } as SettingsPreferences
}

export async function updateDeveloperSettings(
  settings: DeveloperSettings
): Promise<SettingsPreferences> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<SettingsPreferences>(
      'settings-preferences',
      {
        body: { action: 'update', developer_settings: settings },
      }
    )
    if (!error && data) return data
  }
  return { ...DEFAULT_SETTINGS, developer_settings: settings } as SettingsPreferences
}
