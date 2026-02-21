import { useQuery } from '@tanstack/react-query'
import { fetchModuleDashboardHealth } from '@/api/module-dashboard-health'

export const MODULE_DASHBOARD_HEALTH_QUERY_KEY = ['module-dashboard-health'] as const

export function useModuleDashboardHealth() {
  return useQuery({
    queryKey: MODULE_DASHBOARD_HEALTH_QUERY_KEY,
    queryFn: fetchModuleDashboardHealth,
    staleTime: 30 * 1000,
  })
}
