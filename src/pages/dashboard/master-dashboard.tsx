import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMasterDashboard } from '@/hooks/use-master-dashboard'
import { SystemOverview } from '@/components/master-dashboard/SystemOverview'
import { CicdStatusCard } from '@/components/master-dashboard/CicdStatusCard'
import { CronjobsTimeline } from '@/components/master-dashboard/CronjobsTimeline'
import { ActiveRunsFeed } from '@/components/master-dashboard/ActiveRunsFeed'
import { AlertsNotificationsPanel } from '@/components/master-dashboard/AlertsNotificationsPanel'
import { AuditSnapshot } from '@/components/master-dashboard/AuditSnapshot'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/ui/error-state'
import { BookOpen } from 'lucide-react'

function MasterDashboard() {
  const { data, isLoading, isError, refetch } = useMasterDashboard()

  useEffect(() => {
    const prevTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    document.title = 'Master Dashboard | LifeOps'
    if (meta) {
      meta.setAttribute('content', 'Central command center: system health, active agents, upcoming Cronjobs, alerts, and quick controls')
    }
    return () => {
      document.title = prevTitle
      if (meta) meta.setAttribute('content', prevDesc)
    }
  }, [])

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Master Dashboard</h1>
          <p className="text-muted-foreground mt-1">System health and orchestration overview</p>
        </div>
        <ErrorState
          heading="Something went wrong"
          description="Failed to load dashboard data."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8" aria-busy={isLoading} aria-label="Master Dashboard">
      <div className="animate-fade-in flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl" id="master-dashboard-title">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-accent">
              Master Dashboard
            </span>
          </h1>
          <p className="text-muted-foreground mt-1 text-base">
            Central command center: system health, active agents, upcoming Cronjobs, and quick controls
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="shrink-0 gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
          <Link to="/docs-help" aria-describedby="master-dashboard-title">
            <BookOpen className="h-4 w-4" />
            Docs & Help
          </Link>
        </Button>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        <SystemOverview data={data?.overview} isLoading={isLoading} />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
        <CicdStatusCard />
      </div>

      <div
        className="grid gap-6 lg:grid-cols-2 animate-slide-up"
        style={{ animationDelay: '200ms' }}
      >
        <CronjobsTimeline cronjobs={data?.cronjobs} isLoading={isLoading} />
        <ActiveRunsFeed runs={data?.activeRuns} isLoading={isLoading} />
      </div>

      <div
        className="grid gap-6 lg:grid-cols-2 animate-slide-up"
        style={{ animationDelay: '300ms' }}
      >
        <AlertsNotificationsPanel alerts={data?.alerts} isLoading={isLoading} />
        <AuditSnapshot items={data?.auditSnapshot} isLoading={isLoading} />
      </div>
    </div>
  )
}

export { MasterDashboard }
export default MasterDashboard
