import { CheckCircle, AlertTriangle, XCircle, GitBranch, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import type { ChangelogEntry, SystemStatus } from '@/types/docs-help'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<
  SystemStatus['status'],
  { icon: React.ComponentType<{ className?: string }>; color: string; label: string }
> = {
  operational: { icon: CheckCircle, color: 'text-success', label: 'Operational' },
  degraded: { icon: AlertTriangle, color: 'text-warning', label: 'Degraded' },
  outage: { icon: XCircle, color: 'text-destructive', label: 'Outage' },
}

interface ChangelogStatusProps {
  changelog: ChangelogEntry[]
  status: SystemStatus[]
  isLoading?: boolean
}

export function ChangelogStatus({ changelog, status, isLoading }: ChangelogStatusProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2 text-xl">
            <GitBranch className="h-5 w-5 text-primary" />
            Changelog
          </CardTitle>
          <CardDescription>Release notes and updates</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {changelog.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No releases yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Release notes will appear here when available.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
              {changelog.map((entry) => (
                <div
                  key={entry.id}
                  className="px-6 py-4 hover:bg-primary/5 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="font-mono text-xs">
                      v{entry.version}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{entry.date}</span>
                  </div>
                  <h4 className="font-semibold mt-2 text-foreground">{entry.title}</h4>
                  <ul className="mt-2 space-y-1">
                    {entry.changes.map((change, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-accent/5 to-primary/5">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="h-5 w-5 text-accent" />
            System Status
          </CardTitle>
          <CardDescription>Current system health</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {status.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Status unavailable</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                System status will be displayed here when available.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {status.map((s) => {
                const config = STATUS_CONFIG[s.status as SystemStatus['status']] ?? STATUS_CONFIG.operational
                const Icon = config.icon
                return (
                  <div
                    key={s.service}
                    className="flex items-center justify-between px-6 py-4 hover:bg-primary/5 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn('h-5 w-5', config.color)} />
                      <div>
                        <p className="font-medium text-foreground">{s.service}</p>
                        {s.message && (
                          <p className="text-xs text-muted-foreground">{s.message}</p>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={s.status === 'operational' ? 'secondary' : 'destructive'}
                      className={cn(
                        'capitalize',
                        s.status === 'operational' && 'bg-success/20 text-success border-success/30'
                      )}
                    >
                      {config.label}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
