import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchModuleDashboardContent, scheduleContentToSlot } from '@/api/module-dashboard-content'

export const MODULE_DASHBOARD_CONTENT_QUERY_KEY = ['module-dashboard-content'] as const

export function useModuleDashboardContent() {
  return useQuery({
    queryKey: MODULE_DASHBOARD_CONTENT_QUERY_KEY,
    queryFn: fetchModuleDashboardContent,
    staleTime: 30 * 1000,
  })
}

export function useScheduleContentToSlot() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ slotId, contentId }: { slotId: string; contentId: string }) =>
      scheduleContentToSlot(slotId, contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODULE_DASHBOARD_CONTENT_QUERY_KEY })
    },
  })
}
