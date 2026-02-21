import { supabase } from '@/lib/supabase'
import type {
  EmailVerificationStatus,
  VerifyCodeResponse,
  ResendResponse,
} from '@/types/email-verification'

export async function fetchEmailVerificationStatus(): Promise<EmailVerificationStatus> {
  if (!supabase) {
    return {
      verified: false,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      can_resend_at: undefined,
    }
  }
  const { data, error } = await supabase.functions.invoke<EmailVerificationStatus>(
    'email-verification',
    { body: { action: 'get_status' } }
  )
  if (error) throw new Error(error.message)
  if (!data) return { verified: false }
  return data
}

export async function verifyCode(code: string): Promise<VerifyCodeResponse> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' }
  }
  const { data, error } = await supabase.functions.invoke<VerifyCodeResponse>(
    'email-verification',
    { body: { action: 'verify', code } }
  )
  if (error) return { success: false, error: error.message }
  return data ?? { success: false, error: 'Unknown error' }
}

export async function resendVerificationEmail(): Promise<ResendResponse> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' }
  }
  const { data, error } = await supabase.functions.invoke<ResendResponse>(
    'email-verification',
    { body: { action: 'resend' } }
  )
  if (error) return { success: false, error: error.message }
  return data ?? { success: false, error: 'Unknown error' }
}
