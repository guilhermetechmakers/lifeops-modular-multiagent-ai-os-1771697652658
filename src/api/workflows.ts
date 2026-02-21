import { apiGet } from '@/lib/api'
import type { ApiError } from '@/lib/api'

export type WorkflowModule = 'all' | 'Content' | 'Projects' | 'Finance' | 'Health'

export interface WorkflowTemplate {
  id: string
  name: string
  domain: string
  rating: number
  uses: number
}

export interface WorkflowTemplatesResponse {
  templates: WorkflowTemplate[]
}

const MOCK_TEMPLATES: WorkflowTemplate[] = [
  { id: '1', name: 'Weekly Digest', domain: 'Content', rating: 4.8, uses: 1200 },
  { id: '2', name: 'PR Triage', domain: 'Projects', rating: 4.9, uses: 890 },
  { id: '3', name: 'Monthly Close', domain: 'Finance', rating: 4.6, uses: 450 },
]

function filterByModule(templates: WorkflowTemplate[], module: WorkflowModule): WorkflowTemplate[] {
  if (module === 'all') return templates
  return templates.filter((t) => t.domain === module)
}

export async function fetchWorkflowTemplates(
  moduleFilter: WorkflowModule = 'all'
): Promise<WorkflowTemplatesResponse> {
  try {
    const params = moduleFilter !== 'all' ? `?module=${encodeURIComponent(moduleFilter)}` : ''
    const data = await apiGet<WorkflowTemplatesResponse>(`/workflows/templates${params}`)
    const templates = data?.templates ?? MOCK_TEMPLATES
    return { templates: filterByModule(templates, moduleFilter) }
  } catch (err) {
    const apiErr = err as ApiError
    if (apiErr?.status === 404) {
      return { templates: filterByModule(MOCK_TEMPLATES, moduleFilter) }
    }
    throw new Error(apiErr?.message ?? 'Failed to load workflow templates. Please try again.')
  }
}
