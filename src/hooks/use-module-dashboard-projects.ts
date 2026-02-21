import { useQuery } from '@tanstack/react-query'
import { fetchModuleDashboardProjects } from '@/api/module-dashboard-projects'

export const MODULE_DASHBOARD_PROJECTS_QUERY_KEY = ['module-dashboard-projects'] as const

export function useModuleDashboardProjects() {
  return useQuery({
    queryKey: MODULE_DASHBOARD_PROJECTS_QUERY_KEY,
    queryFn: fetchModuleDashboardProjects,
    staleTime: 30 * 1000,
  })
}
