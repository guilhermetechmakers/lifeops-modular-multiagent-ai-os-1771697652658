export interface OrganizationTeamSettings {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
  team_roster?: TeamRosterData
  rbac_policies?: RBACPoliciesData
  billing?: BillingData
  enterprise?: EnterpriseData
}

export interface TeamMember {
  id: string
  email: string
  name?: string
  role: string
  status: 'active' | 'pending' | 'suspended'
  seatAllocated: boolean
  invitedAt?: string
  joinedAt?: string
}

export interface TeamRosterData {
  members: TeamMember[]
  totalSeats: number
  usedSeats: number
  roles: { id: string; name: string; description: string }[]
}

export interface RBACRole {
  id: string
  name: string
  description: string
  permissions: string[]
}

export interface RBACPoliciesData {
  roles: RBACRole[]
  agentPermissions: Record<string, string[]>
  cronjobPermissions: Record<string, string[]>
}

export interface BillingData {
  plan: string
  planId: string
  status: 'active' | 'past_due' | 'canceled' | 'trialing'
  currentPeriodEnd?: string
  stripeCustomerId?: string
  invoices: Invoice[]
  paymentMethods: PaymentMethod[]
  usageSummary: UsageSummary
}

export interface Invoice {
  id: string
  date: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  downloadUrl?: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank'
  last4: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

export interface UsageSummary {
  agents: number
  cronjobs: number
  apiCalls: number
  storageGb: number
}

export interface EnterpriseData {
  samlEnabled: boolean
  samlEntityId?: string
  samlSsoUrl?: string
  provisioningEnabled: boolean
  scimEndpoint?: string
  onPremAgentRunnerEnabled: boolean
  onPremRunnerUrl?: string
  dataResidency: 'us' | 'eu' | 'custom'
  dataResidencyRegion?: string
}
