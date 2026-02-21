import { useQuery } from '@tanstack/react-query'
import { fetchModuleDashboardProjects } from '@/api/module-dashboard-projects'
import type { Ticket } from '@/types/module-dashboard-projects'

export interface ProjectsDashboardPayload {
  activeProjects: number
  openPRs: number
  sprintProgress: number
  tickets: Ticket[]
}

async function fetchProjectsDashboard(): Promise<ProjectsDashboardPayload> {
  const data = await fetchModuleDashboardProjects()
  const openPRs = data.prs?.filter((p) => p.status === 'open').length ?? 0
  const activeProjects = data.projects?.filter((p) => p.status === 'active').length ?? 0
  const totalTasks =
    data.milestones?.flatMap((m) => m.tasks ?? []).length ?? 0
  const doneTasks =
    data.milestones?.flatMap((m) => m.tasks ?? []).filter((t) => t.status === 'done').length ?? 0
  const sprintProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  return {
    activeProjects,
    openPRs,
    sprintProgress,
    tickets: data.tickets ?? [],
  }
}

export const PROJECTS_DASHBOARD_QUERY_KEY = ['projects-dashboard'] as const

export function useProjectsDashboard() {
  return useQuery({
    queryKey: PROJECTS_DASHBOARD_QUERY_KEY,
    queryFn: fetchProjectsDashboard,
    staleTime: 30 * 1000,
  })
}
