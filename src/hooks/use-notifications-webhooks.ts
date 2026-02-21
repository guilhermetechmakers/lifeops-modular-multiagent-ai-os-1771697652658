import { useQuery } from '@tanstack/react-query'
import { fetchInAppNotifications } from '@/api/notifications-webhooks'

export const NOTIFICATIONS_QUERY_KEY = ['notifications-webhooks'] as const

export function useInAppNotifications() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchInAppNotifications,
    staleTime: 15 * 1000,
  })
}
