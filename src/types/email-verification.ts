export interface EmailVerification {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  last_resend_at?: string
  created_at: string
  updated_at: string
}

export interface EmailVerificationStatus {
  verified: boolean
  expires_at?: string
  can_resend_at?: string
  email?: string
}

export interface VerifyCodeResponse {
  success: boolean
  error?: string
}

export interface ResendResponse {
  success: boolean
  can_resend_at?: string
  error?: string
}
