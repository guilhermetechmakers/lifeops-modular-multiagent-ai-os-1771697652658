import { useMutation } from '@tanstack/react-query'
import { reportBrokenLink } from '@/api/not-found-report'
import type { ReportBrokenLinkRequest, ReportBrokenLinkResponse } from '@/types/not-found-report'

export const NOT_FOUND_REPORT_MUTATION_KEY = ['not-found-report'] as const

export function useReportBrokenLink() {
  return useMutation<ReportBrokenLinkResponse, Error, ReportBrokenLinkRequest>({
    mutationKey: NOT_FOUND_REPORT_MUTATION_KEY,
    mutationFn: reportBrokenLink,
  })
}
