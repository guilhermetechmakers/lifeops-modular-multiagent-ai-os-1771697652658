import { fetchMasterDashboard } from '@/api/master-dashboard'
import type { CronjobItem } from '@/types/master-dashboard'

export async function fetchCronjobs(): Promise<CronjobItem[]> {
  const data = await fetchMasterDashboard()
  return data?.cronjobs ?? []
}
