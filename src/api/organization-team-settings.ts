import { supabase } from '@/lib/supabase'
import type {
  OrganizationTeamSettings,
  TeamRosterData,
  RBACPoliciesData,
  BillingData,
  EnterpriseData,
} from '@/types/organization-team-settings'

const DEFAULT_SETTINGS: OrganizationTeamSettings = {
  id: '',
  user_id: '',
  title: 'Organization & Team Settings',
  status: 'active',
  team_roster: {
    members: [],
    totalSeats: 5,
    usedSeats: 0,
    roles: [
      { id: 'admin', name: 'Admin', description: 'Full access' },
      { id: 'member', name: 'Member', description: 'Standard access' },
      { id: 'viewer', name: 'Viewer', description: 'Read-only' },
    ],
  },
  rbac_policies: {
    roles: [],
    agentPermissions: {},
    cronjobPermissions: {},
  },
  billing: {
    plan: 'Pro',
    planId: 'pro',
    status: 'active',
    invoices: [],
    paymentMethods: [],
    usageSummary: { agents: 0, cronjobs: 0, apiCalls: 0, storageGb: 0 },
  },
  enterprise: {
    samlEnabled: false,
    provisioningEnabled: false,
    onPremAgentRunnerEnabled: false,
    dataResidency: 'us',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export async function fetchOrganizationTeamSettings(): Promise<OrganizationTeamSettings> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<OrganizationTeamSettings>(
      'organization-team-settings',
      { body: { action: 'get' } }
    )
    if (!error && data) return data
  }
  return { ...DEFAULT_SETTINGS, id: 'mock', user_id: 'mock' }
}

export async function updateTeamRoster(
  teamRoster: TeamRosterData
): Promise<OrganizationTeamSettings> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<OrganizationTeamSettings>(
      'organization-team-settings',
      { body: { action: 'update', team_roster: teamRoster } }
    )
    if (!error && data) return data
  }
  return { ...DEFAULT_SETTINGS, team_roster: teamRoster } as OrganizationTeamSettings
}

export async function updateRBACPolicies(
  rbacPolicies: RBACPoliciesData
): Promise<OrganizationTeamSettings> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<OrganizationTeamSettings>(
      'organization-team-settings',
      { body: { action: 'update', rbac_policies: rbacPolicies } }
    )
    if (!error && data) return data
  }
  return { ...DEFAULT_SETTINGS, rbac_policies: rbacPolicies } as OrganizationTeamSettings
}

export async function updateBilling(billing: BillingData): Promise<OrganizationTeamSettings> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<OrganizationTeamSettings>(
      'organization-team-settings',
      { body: { action: 'update', billing: billing } }
    )
    if (!error && data) return data
  }
  return { ...DEFAULT_SETTINGS, billing } as OrganizationTeamSettings
}

export async function updateEnterprise(
  enterprise: EnterpriseData
): Promise<OrganizationTeamSettings> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<OrganizationTeamSettings>(
      'organization-team-settings',
      { body: { action: 'update', enterprise } }
    )
    if (!error && data) return data
  }
  return { ...DEFAULT_SETTINGS, enterprise } as OrganizationTeamSettings
}
