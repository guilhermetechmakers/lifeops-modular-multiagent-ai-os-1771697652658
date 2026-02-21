import { FolderKanban, AlertCircle, GitBranch, Ticket } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { OrganizationProject } from '@/types/module-dashboard-projects'

interface ProjectListSelectorProps {
  projects: OrganizationProject[]
  selectedProjectId?: string
  onProjectChange?: (projectId: string) => void
  isLoading?: boolean
}

export function ProjectListSelector({
  projects,
  selectedProjectId,
  onProjectChange,
  isLoading,
}: ProjectListSelectorProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!projects.length) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-muted-foreground" />
            Project List
          </CardTitle>
          <CardDescription>
            No organization projects found. Connect a repository to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <h3 className="font-semibold text-lg">No projects yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Connect GitHub or GitLab to add organization projects and view metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? projects[0]

  return (
    <Card
      className={cn(
        'overflow-hidden border-border/50 transition-all duration-300 cursor-default',
        'hover:shadow-card-hover hover:border-primary/20 animate-fade-in'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            Organization Projects
          </CardTitle>
          <CardDescription>Select a project to view quick metrics</CardDescription>
        </div>
        <Select
          value={selectedProjectId ?? selectedProject.id}
          onValueChange={onProjectChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div
            className={cn(
              'rounded-lg border p-4 transition-all duration-200',
              'bg-gradient-to-br from-primary/10 to-transparent border-primary/20',
              'hover:shadow-md hover:scale-[1.02]'
            )}
          >
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Open Tickets</span>
            </div>
            <p className="text-2xl font-bold mt-2">{selectedProject.metrics.openTickets}</p>
          </div>
          <div
            className={cn(
              'rounded-lg border p-4 transition-all duration-200',
              selectedProject.metrics.ciFailures > 0
                ? 'bg-gradient-to-br from-destructive/10 to-transparent border-destructive/30'
                : 'bg-gradient-to-br from-success/10 to-transparent border-success/20',
              'hover:shadow-md hover:scale-[1.02]'
            )}
          >
            <div className="flex items-center gap-2">
              <AlertCircle
                className={cn(
                  'h-4 w-4',
                  selectedProject.metrics.ciFailures > 0 ? 'text-destructive' : 'text-success'
                )}
              />
              <span className="text-sm font-medium text-muted-foreground">CI Failures</span>
            </div>
            <p
              className={cn(
                'text-2xl font-bold mt-2',
                selectedProject.metrics.ciFailures > 0 ? 'text-destructive' : 'text-success'
              )}
            >
              {selectedProject.metrics.ciFailures}
            </p>
          </div>
          <div
            className={cn(
              'rounded-lg border p-4 transition-all duration-200',
              'bg-gradient-to-br from-accent/10 to-transparent border-accent/20',
              'hover:shadow-md hover:scale-[1.02]'
            )}
          >
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Active PRs</span>
            </div>
            <p className="text-2xl font-bold mt-2">{selectedProject.metrics.activePRs}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
