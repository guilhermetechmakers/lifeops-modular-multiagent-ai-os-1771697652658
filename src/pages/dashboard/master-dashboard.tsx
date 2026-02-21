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
import { AlertCircle, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

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
        <div
          className={cn(
            'flex flex-col items-center justify-center py-16 rounded-2xl border border-destructive/30',
            'bg-destructive/5 transition-all duration-300 hover:border-destructive/40'
          )}
        >
          <AlertCircle className="h-12 w-12 text-destructive mb-4" aria-hidden />
          <h3 className="font-semibold text-lg">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mt-1">Failed to load dashboard data.</p>
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
      <div className="animate-fade-in flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-accent">
              Master Dashboard
            </span>
          </h1>
          <p className="text-muted-foreground mt-1 text-base">
            Central command center: system health, active agents, upcoming Cronjobs, and quick controls
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="shrink-0 gap-2">
          <Link to="/docs-help">
            <BookOpen className="h-4 w-4" />
            Docs & Help
          </Link>
        </Button>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <SystemOverview data={data?.overview} isLoading={isLoading} />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
        <CicdStatusCard />
      </div>

      <div
        className="grid gap-6 lg:grid-cols-2 animate-fade-in"
        style={{ animationDelay: '200ms' }}
      >
        <CronjobsTimeline cronjobs={data?.cronjobs} isLoading={isLoading} />
        <ActiveRunsFeed runs={data?.activeRuns} isLoading={isLoading} />
      </div>

      <div
        className="grid gap-6 lg:grid-cols-2 animate-fade-in"
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
