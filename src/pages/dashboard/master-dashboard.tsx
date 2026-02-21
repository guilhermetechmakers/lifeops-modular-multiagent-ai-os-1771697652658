import { useMasterDashboard } from '@/hooks/use-master-dashboard'
import { SystemOverview } from '@/components/master-dashboard/SystemOverview'
import { CronjobsTimeline } from '@/components/master-dashboard/CronjobsTimeline'
import { ActiveRunsFeed } from '@/components/master-dashboard/ActiveRunsFeed'
import { AlertsNotificationsPanel } from '@/components/master-dashboard/AlertsNotificationsPanel'
import { AuditSnapshot } from '@/components/master-dashboard/AuditSnapshot'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

function MasterDashboard() {
  const { data, isLoading, isError, refetch } = useMasterDashboard()

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Master Dashboard</h1>
          <p className="text-muted-foreground mt-1">System health and orchestration overview</p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-destructive/30 bg-destructive/5">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="font-semibold text-lg">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mt-1">Failed to load dashboard data.</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Master Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Central command center: system health, active agents, upcoming Cronjobs, and quick controls
        </p>
      </div>

      <SystemOverview data={data?.overview} isLoading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CronjobsTimeline cronjobs={data?.cronjobs} isLoading={isLoading} />
        <ActiveRunsFeed runs={data?.activeRuns} isLoading={isLoading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AlertsNotificationsPanel alerts={data?.alerts} isLoading={isLoading} />
        <AuditSnapshot items={data?.auditSnapshot} isLoading={isLoading} />
      </div>
    </div>
  )
}

export { MasterDashboard }
export default MasterDashboard
