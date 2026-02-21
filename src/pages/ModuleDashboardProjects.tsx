import { useEffect, useState } from 'react'
import { useModuleDashboardProjects } from '@/hooks/use-module-dashboard-projects'
import { ProjectListSelector } from '@/components/module-dashboard-projects/ProjectListSelector'
import { RoadmapView } from '@/components/module-dashboard-projects/RoadmapView'
import { TicketBoard } from '@/components/module-dashboard-projects/TicketBoard'
import { PRReleasePane } from '@/components/module-dashboard-projects/PRReleasePane'
import { IntegrationsPanel } from '@/components/module-dashboard-projects/IntegrationsPanel'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

function ModuleDashboardProjects() {
  const { data, isLoading, isError, refetch } = useModuleDashboardProjects()
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>()

  useEffect(() => {
    document.title = 'Module Dashboard — Projects | LifeOps'
  }, [])

  useEffect(() => {
    if (data?.projects?.[0] && !selectedProjectId) {
      setSelectedProjectId(data.projects[0].id)
    }
  }, [data?.projects, selectedProjectId])

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Module Dashboard — Projects</h1>
          <p className="text-muted-foreground mt-1">
            Developer-centric project automation
          </p>
        </div>
        <div
          className={cn(
            'flex flex-col items-center justify-center py-16 rounded-2xl border border-destructive/30',
            'bg-destructive/5 transition-all duration-300 hover:border-destructive/40'
          )}
        >
          <AlertCircle className="h-12 w-12 text-destructive mb-4" aria-hidden />
          <h3 className="font-semibold text-lg">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Failed to load module dashboard data.
          </p>
          <Button
            variant="outline"
            className="mt-4 transition-all duration-200 hover:scale-[1.02]"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-accent">
            Module Dashboard — Projects
          </span>
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          Developer-centric project automation: roadmaps, tickets, PRs, releases and CI integrations
        </p>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <ProjectListSelector
          projects={data?.projects ?? []}
          selectedProjectId={selectedProjectId}
          onProjectChange={setSelectedProjectId}
          isLoading={isLoading}
        />
      </div>

      <div
        className="grid gap-6 lg:grid-cols-2 animate-fade-in"
        style={{ animationDelay: '200ms' }}
      >
        <RoadmapView milestones={data?.milestones ?? []} isLoading={isLoading} />
        <TicketBoard tickets={data?.tickets ?? []} isLoading={isLoading} />
      </div>

      <div
        className="grid gap-6 lg:grid-cols-2 animate-fade-in"
        style={{ animationDelay: '300ms' }}
      >
        <PRReleasePane prs={data?.prs ?? []} isLoading={isLoading} />
        <IntegrationsPanel integrations={data?.integrations ?? []} isLoading={isLoading} />
      </div>
    </div>
  )
}

export { ModuleDashboardProjects }
export default ModuleDashboardProjects
