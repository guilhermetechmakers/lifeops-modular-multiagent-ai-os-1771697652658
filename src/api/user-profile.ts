import { supabase } from '@/lib/supabase'
import type {
  UserProfile,
  ProfileInfo,
  Connection,
  AgentPresets,
  SecuritySettings,
} from '@/types/user-profile'

const DEFAULT_PROFILE: UserProfile = {
  id: '',
  user_id: '',
  title: 'User Profile',
  status: 'active',
  profile_info: {
    name: 'User',
    email: '',
    timezone: 'UTC',
    language: 'en',
  },
  connections: [
    { id: 'gh', service: 'GitHub', status: 'connected', health: 'healthy' },
    { id: 'plaid', service: 'Plaid', status: 'disconnected' },
    { id: 'cms', service: 'Contentful', status: 'disconnected' },
    { id: 'linear', service: 'Linear', status: 'connected', health: 'degraded' },
  ],
  api_keys: [],
  agent_presets: { default_behavior: 'helpful', memory_scope: 'project', temperature: 0.7 },
  security_settings: { two_fa_enabled: false, sessions: [] },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export async function fetchUserProfile(): Promise<UserProfile> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<UserProfile>('user-profile', {
      body: { action: 'get' },
    })
    if (!error && data) return data
  }
  return { ...DEFAULT_PROFILE, id: 'mock', user_id: 'mock' }
}

export async function updateProfileInfo(info: ProfileInfo): Promise<UserProfile> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<UserProfile>('user-profile', {
      body: { action: 'update', profile_info: info },
    })
    if (!error && data) return data
  }
  return { ...DEFAULT_PROFILE, profile_info: info } as UserProfile
}

export async function updateConnections(connections: Connection[]): Promise<UserProfile> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<UserProfile>('user-profile', {
      body: { action: 'update', connections },
    })
    if (!error && data) return data
  }
  return { ...DEFAULT_PROFILE, connections } as UserProfile
}

export async function revokeConnection(connectionId: string): Promise<UserProfile> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<UserProfile>('user-profile', {
      body: { action: 'revoke_connection', connection_id: connectionId },
    })
    if (!error && data) return data
  }
  return DEFAULT_PROFILE
}

export async function createApiKey(name: string, scope?: string[]): Promise<UserProfile & { _new_key_preview?: string }> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<UserProfile & { _new_key_preview?: string }>(
      'user-profile',
      { body: { action: 'create_api_key', name, scope: scope ?? ['read'] } }
    )
    if (!error && data) return data
  }
  return DEFAULT_PROFILE
}

export async function revokeApiKey(keyId: string): Promise<UserProfile> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<UserProfile>('user-profile', {
      body: { action: 'revoke_api_key', key_id: keyId },
    })
    if (!error && data) return data
  }
  return DEFAULT_PROFILE
}

export async function updateAgentPresets(presets: AgentPresets): Promise<UserProfile> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<UserProfile>('user-profile', {
      body: { action: 'update', agent_presets: presets },
    })
    if (!error && data) return data
  }
  return { ...DEFAULT_PROFILE, agent_presets: presets } as UserProfile
}

export async function updateSecuritySettings(settings: SecuritySettings): Promise<UserProfile> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<UserProfile>('user-profile', {
      body: { action: 'update', security_settings: settings },
    })
    if (!error && data) return data
  }
  return { ...DEFAULT_PROFILE, security_settings: settings } as UserProfile
}
