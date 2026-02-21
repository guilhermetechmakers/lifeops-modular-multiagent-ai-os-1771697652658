import { supabase } from '@/lib/supabase'
import type { ReportBrokenLinkRequest, ReportBrokenLinkResponse } from '@/types/not-found-report'

export async function reportBrokenLink(
  request: ReportBrokenLinkRequest
): Promise<ReportBrokenLinkResponse> {
  if (!supabase) {
    throw new Error('Reporting is not available')
  }

  const { data, error } = await supabase.functions.invoke<ReportBrokenLinkResponse>(
    'not-found-report',
    {
      method: 'POST',
      body: request,
    }
  )

  if (error) {
    throw new Error(error.message ?? 'Failed to report broken link')
  }

  if (!data) {
    return { id: '', success: true }
  }

  return data
}
