import { useQuery } from '@tanstack/react-query'
import { fetchPrivacyPolicy } from '@/api/privacy-policy'

export const PRIVACY_POLICY_QUERY_KEY = ['privacy-policy'] as const

export function usePrivacyPolicy() {
  return useQuery({
    queryKey: PRIVACY_POLICY_QUERY_KEY,
    queryFn: fetchPrivacyPolicy,
    staleTime: 60 * 60 * 1000,
  })
}
