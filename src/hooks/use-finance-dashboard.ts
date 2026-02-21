import { useQuery } from '@tanstack/react-query'
import { fetchFinanceDashboard } from '@/api/finance-dashboard'

export const FINANCE_DASHBOARD_QUERY_KEY = ['finance-dashboard'] as const

export function useFinanceDashboard() {
  return useQuery({
    queryKey: FINANCE_DASHBOARD_QUERY_KEY,
    queryFn: fetchFinanceDashboard,
    staleTime: 30 * 1000,
  })
}
