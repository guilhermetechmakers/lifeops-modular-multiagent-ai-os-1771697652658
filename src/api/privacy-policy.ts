import { supabase } from '@/lib/supabase'
import type { PrivacyPolicyData } from '@/types/privacy-policy'

export async function fetchPrivacyPolicy(): Promise<PrivacyPolicyData> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<PrivacyPolicyData>(
      'privacy-policy',
      { body: { action: 'get' } }
    )
    if (!error && data) return data
  }
  return {
    sections: [],
    dpo: {
      name: 'Data Protection Officer',
      email: 'dpo@lifeops.io',
      address: 'LifeOps Inc., Privacy Team',
      responseTime: 'Within 30 days',
    },
    lastUpdated: '2025-02-21',
  }
}

export async function exportPrivacyPolicyPdf(): Promise<{ html: string }> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<{ html: string }>(
      'privacy-policy',
      { body: { action: 'export_pdf' } }
    )
    if (!error && data?.html) return data
    if (error) throw new Error(error.message)
  }
  throw new Error('Supabase not configured')
}
