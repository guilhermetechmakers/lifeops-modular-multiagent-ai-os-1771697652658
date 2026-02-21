import { useQuery } from '@tanstack/react-query'
import { fetchCronjobs } from '@/api/cronjobs'

export const CRONJOBS_QUERY_KEY = ['cronjobs'] as const

export function useCronjobs() {
  return useQuery({
    queryKey: CRONJOBS_QUERY_KEY,
    queryFn: fetchCronjobs,
    staleTime: 60 * 1000,
  })
}
