import { useQuery } from '@tanstack/react-query'
import { fetchTermsOfService } from '@/api/terms-of-service'

export const TERMS_OF_SERVICE_QUERY_KEY = ['terms-of-service'] as const

export function useTermsOfService(version?: string) {
  return useQuery({
    queryKey: [...TERMS_OF_SERVICE_QUERY_KEY, version ?? 'current'],
    queryFn: () => fetchTermsOfService(version),
    staleTime: 60 * 60 * 1000,
  })
}
