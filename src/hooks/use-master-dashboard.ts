import { useQuery } from '@tanstack/react-query'
import { fetchMasterDashboard } from '@/api/master-dashboard'

export const MASTER_DASHBOARD_QUERY_KEY = ['master-dashboard'] as const

export function useMasterDashboard() {
  return useQuery({
    queryKey: MASTER_DASHBOARD_QUERY_KEY,
    queryFn: fetchMasterDashboard,
    staleTime: 30 * 1000,
  })
}
