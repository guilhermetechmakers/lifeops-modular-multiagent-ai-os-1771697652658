import { supabase } from '@/lib/supabase'
import type { TermsOfServiceData } from '@/types/terms-of-service'

export async function fetchTermsOfService(version?: string): Promise<TermsOfServiceData> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<TermsOfServiceData>(
      'terms-of-service',
      { body: { action: 'get', version } }
    )
    if (!error && data) return data
  }
  return {
    sections: [],
    version: { version: '1.0.0', effectiveDate: '2025-02-21', changelog: 'Initial release' },
    versions: [{ version: '1.0.0', effectiveDate: '2025-02-21', changelog: 'Initial release' }],
  }
}

export async function exportTermsOfServicePdf(version?: string): Promise<{ html: string }> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<{ html: string }>(
      'terms-of-service',
      { body: { action: 'export_pdf', version } }
    )
    if (!error && data?.html) return data
    if (error) throw new Error(error.message)
  }
  throw new Error('Supabase not configured')
}

export async function exportTermsOfServiceText(version?: string): Promise<{ text: string }> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<{ text: string }>(
      'terms-of-service',
      { body: { action: 'export_text', version } }
    )
    if (!error && data?.text) return data
    if (error) throw new Error(error.message)
  }
  throw new Error('Supabase not configured')
}
