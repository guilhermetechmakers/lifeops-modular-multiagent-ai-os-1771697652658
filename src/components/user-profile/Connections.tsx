import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plug,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Unplug,
  Github,
  Building2,
  FileText,
  Activity,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Connection } from '@/types/user-profile'
import { useRevokeConnection } from '@/hooks/use-user-profile'

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: Github,
  Plaid: Building2,
  Contentful: FileText,
  Linear: Activity,
  default: Plug,
}

interface ConnectionsProps {
  connections?: Connection[]
  isLoading?: boolean
}

export function Connections({ connections = [], isLoading }: ConnectionsProps) {
  const revokeMutation = useRevokeConnection()
  const items = connections

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const empty = items.length === 0

  if (empty) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Plug className="h-5 w-5 text-primary" />
            Connections
          </CardTitle>
          <CardDescription>
            Linked services (GitHub, banks, CMS, trackers) with connection health and revoke controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <Plug className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Connect GitHub, banks, CMS, or trackers to streamline your workflow
            </p>
            <Button
              className="transition-all duration-200 hover:scale-[1.02]"
              aria-label="Connect your first service"
            >
              Connect first service
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Plug className="h-5 w-5 text-primary" />
          Connections
        </CardTitle>
        <CardDescription>
          Linked services (GitHub, banks, CMS, trackers) with connection health and revoke controls
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((conn) => {
            const Icon = SERVICE_ICONS[conn.service] ?? SERVICE_ICONS.default
            const isConnected = conn.status === 'connected'
            return (
              <div
                key={conn.id}
                className={cn(
                  'flex items-center justify-between rounded-xl border p-4 transition-all duration-200',
                  'hover:shadow-md hover:border-primary/30',
                  'border-border'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{conn.service}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={isConnected ? 'success' : 'secondary'}
                        className="text-xs"
                      >
                        {conn.health === 'healthy' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {conn.health === 'degraded' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {conn.health === 'unhealthy' && <XCircle className="h-3 w-3 mr-1" />}
                        {conn.status}
                      </Badge>
                      {conn.health && (
                        <span className="text-xs text-muted-foreground capitalize">
                          {conn.health}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant={isConnected ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => (isConnected ? revokeMutation.mutate(conn.id) : null)}
                  disabled={revokeMutation.isPending}
                  className="transition-transform duration-200 hover:scale-[1.02]"
                  aria-label={isConnected ? `Revoke ${conn.service} connection` : `Connect ${conn.service}`}
                >
                  {isConnected ? (
                    <>
                      <Unplug className="h-4 w-4 mr-1" />
                      Revoke
                    </>
                  ) : (
                    'Connect'
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
