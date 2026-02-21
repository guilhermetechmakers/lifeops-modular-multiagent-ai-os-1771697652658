import { useQuery } from '@tanstack/react-query'
import { fetchWorkflowTemplates } from '@/api/workflows'
import type { WorkflowModule } from '@/api/workflows'

export const WORKFLOW_TEMPLATES_QUERY_KEY = ['workflows', 'templates'] as const

export function useWorkflowTemplates(moduleFilter: WorkflowModule = 'all') {
  return useQuery({
    queryKey: [...WORKFLOW_TEMPLATES_QUERY_KEY, moduleFilter],
    queryFn: () => fetchWorkflowTemplates(moduleFilter),
    staleTime: 60 * 1000,
  })
}
