import { supabase } from '@/lib/supabase'
import type { ModuleDashboardProjectsPayload } from '@/types/module-dashboard-projects'

const MOCK_PAYLOAD: ModuleDashboardProjectsPayload = {
  projects: [
    { id: '1', name: 'LifeOps Core', metrics: { openTickets: 12, ciFailures: 2, activePRs: 5 }, status: 'active' },
    { id: '2', name: 'Content Pipeline', metrics: { openTickets: 8, ciFailures: 0, activePRs: 3 }, status: 'active' },
    { id: '3', name: 'Agent Framework', metrics: { openTickets: 24, ciFailures: 1, activePRs: 7 }, status: 'active' },
  ],
  milestones: [
    {
      id: '1',
      title: 'Q1 Release',
      dueDate: '2025-03-31',
      status: 'in-progress',
      tasks: [
        { id: 't1', title: 'Auth refactor', status: 'done', agentSuggested: false },
        { id: 't2', title: 'Dashboard v2', status: 'in-progress', agentSuggested: true },
        { id: 't3', title: 'API docs', status: 'todo', agentSuggested: true },
      ],
    },
    {
      id: '2',
      title: 'Q2 Planning',
      dueDate: '2025-06-30',
      status: 'planned',
      tasks: [{ id: 't4', title: 'Multi-tenant support', status: 'todo', agentSuggested: true }],
    },
  ],
  tickets: [
    { id: '1', title: 'Fix auth flow', status: 'in-progress', priority: 'high', agentSuggested: false, projectId: '1' },
    { id: '2', title: 'Add API docs', status: 'todo', priority: 'medium', agentSuggested: true, projectId: '1' },
    { id: '3', title: 'Refactor dashboard', status: 'done', priority: 'low', agentSuggested: false, projectId: '1' },
    { id: '4', title: 'Improve error handling', status: 'review', priority: 'high', agentSuggested: true, projectId: '2' },
  ],
  prs: [
    { id: '1', title: 'feat: Add module dashboard', branch: 'feat/module-dashboard', status: 'open', linkedTicketIds: ['1', '2'] },
    { id: '2', title: 'fix: Auth token refresh', branch: 'fix/auth-refresh', status: 'merged', linkedTicketIds: ['1'] },
  ],
  integrations: [
    { id: '1', type: 'github', name: 'lifeops/main', connected: true, lastSync: new Date().toISOString() },
    { id: '2', type: 'gitlab', name: 'internal/backend', connected: false },
  ],
}

export async function fetchModuleDashboardProjects(): Promise<ModuleDashboardProjectsPayload> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<ModuleDashboardProjectsPayload>(
      'module-dashboard-projects',
      { method: 'POST' }
    )
    if (!error && data) return data
  }
  return MOCK_PAYLOAD
}
