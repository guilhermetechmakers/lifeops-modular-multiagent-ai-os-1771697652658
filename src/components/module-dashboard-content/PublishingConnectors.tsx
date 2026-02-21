import { Plug, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ConnectorStatus } from '@/types/module-dashboard-content'

interface PublishingConnectorsProps {
  connectors: ConnectorStatus[]
  isLoading?: boolean
}

const PLATFORM_ICONS: Record<string, string> = {
  wordpress: 'W',
  contentful: 'C',
  twitter: '𝕏',
  linkedin: 'in',
  newsletter: '✉',
}

const HEALTH_CONFIG = {
  healthy: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' },
  degraded: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
  error: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
}

export function PublishingConnectors({ connectors, isLoading }: PublishingConnectorsProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!connectors.length) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-primary" />
            Publishing Connectors
          </CardTitle>
          <CardDescription>CMS, social, newsletter integrations and schedule controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <Plug className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <h3 className="font-semibold text-lg">No connectors</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Connect WordPress, Contentful, Twitter/X, LinkedIn, or newsletter platforms to publish content.
            </p>
            <Button className="mt-4 transition-all duration-200 hover:scale-[1.02]">Add connector</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'overflow-hidden border-border/50 transition-all duration-300',
        'hover:shadow-card-hover hover:border-primary/20 animate-fade-in'
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plug className="h-5 w-5 text-primary" />
          Publishing Connectors
        </CardTitle>
        <CardDescription>CMS, social, newsletter integrations and schedule controls</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {connectors.map((conn) => {
            const config = HEALTH_CONFIG[conn.health] ?? HEALTH_CONFIG.error
            const Icon = config.icon
            return (
              <div
                key={conn.id}
                className={cn(
                  'rounded-lg border p-4 transition-all duration-200',
                  'flex items-center justify-between gap-4',
                  config.bg,
                  config.border,
                  'hover:shadow-md hover:scale-[1.02]'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card border border-border">
                    <span className="text-sm font-bold">{PLATFORM_ICONS[conn.type] ?? conn.type[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{conn.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{conn.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Icon className={cn('h-5 w-5', config.color)} aria-hidden />
                  {conn.connected ? (
                    <>
                      {conn.lastSync && (
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                          Synced
                        </span>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Refresh">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" className="transition-all duration-200 hover:scale-[1.02]">
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
