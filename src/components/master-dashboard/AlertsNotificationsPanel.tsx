import { useNavigate, Link } from 'react-router-dom'
import { AlertCircle, AlertTriangle, XCircle, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { AlertItem } from '@/types/master-dashboard'
import { cn } from '@/lib/utils'

interface AlertsNotificationsPanelProps {
  alerts?: AlertItem[]
  isLoading?: boolean
}

const severityConfig = {
  critical: { icon: XCircle, variant: 'destructive' as const, bg: 'bg-destructive/10 border-destructive/30' },
  high: { icon: AlertTriangle, variant: 'destructive' as const, bg: 'bg-amber-500/10 border-amber-500/30' },
  medium: { icon: AlertCircle, variant: 'warning' as const, bg: 'bg-warning/10 border-warning/30' },
  low: { icon: AlertCircle, variant: 'secondary' as const, bg: 'bg-muted/50 border-border' },
}

const typeLabels: Record<AlertItem['type'], string> = {
  cronjob_failed: 'Cronjob Failed',
  agent_conflict: 'Agent Conflict',
  connector_expiring: 'Connector Expiring',
  other: 'Other',
}

const getAlertHref = (alert: AlertItem): string => {
  if (alert.type === 'cronjob_failed') return '/dashboard/cronjobs'
  if (alert.type === 'agent_conflict') return '/dashboard/agent-directory'
  if (alert.type === 'connector_expiring') return '/dashboard/connectors'
  return '/dashboard/overview'
}

export function AlertsNotificationsPanel({ alerts = [], isLoading }: AlertsNotificationsPanelProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (alerts.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>Critical alerts, agent conflicts, and failed runs</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild className="gap-1">
            <Link to="/dashboard/settings?tab=notifications">
              <Settings className="h-4 w-4" />
              Configure
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-success mb-4 opacity-70" aria-hidden />
            <h3 className="font-semibold text-lg">All clear</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              No critical alerts. Your system is running smoothly.
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/dashboard/settings?tab=notifications">Configure notification rules</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Alerts & Notifications</CardTitle>
          <CardDescription>Critical alerts, agent conflicts, and failed runs</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild className="gap-1">
          <Link to="/dashboard/settings?tab=notifications">
            <Settings className="h-4 w-4" />
            Configure
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const config = severityConfig[alert.severity]
            const Icon = config.icon
            return (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-4 rounded-xl border p-4 transition-all duration-300',
                  config.bg,
                  'hover:shadow-md'
                )}
              >
                <Icon className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{typeLabels[alert.type]}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => navigate(getAlertHref(alert))}>
                  View
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
