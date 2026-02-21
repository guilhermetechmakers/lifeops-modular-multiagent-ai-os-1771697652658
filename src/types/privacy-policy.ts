export interface PrivacyPolicySection {
  id: string
  title: string
  content: string
}

export interface DpoContact {
  name: string
  email: string
  address: string
  responseTime: string
}

export interface PrivacyPolicyData {
  sections: PrivacyPolicySection[]
  dpo: DpoContact
  lastUpdated: string
}

export interface PrivacyPolicy {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}
