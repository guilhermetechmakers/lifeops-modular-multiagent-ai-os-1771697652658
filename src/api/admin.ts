import { apiGet } from '@/lib/api'
import type { AuditItem } from '@/types/master-dashboard'

export interface AdminAuditResponse {
  items: AuditItem[]
}

const MOCK_AUDIT: AuditItem[] = [
  { id: '1', action: 'Approved PR merge', entity: 'PR #234', timestamp: new Date().toISOString() },
  { id: '2', action: 'Created Cronjob', entity: 'Weekly Digest', timestamp: new Date().toISOString() },
  { id: '3', action: 'Agent enabled', entity: 'PR Triage', timestamp: new Date(Date.now() - 3600000).toISOString() },
]

export async function fetchAdminAudit(): Promise<AdminAuditResponse> {
  try {
    const data = await apiGet<AdminAuditResponse>('/admin/audit')
    return data ?? { items: MOCK_AUDIT }
  } catch {
    return { items: MOCK_AUDIT }
  }
}

