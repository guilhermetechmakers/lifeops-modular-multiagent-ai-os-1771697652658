import { Plug, Github, Gitlab, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Integration } from '@/types/module-dashboard-projects'

interface IntegrationsPanelProps {
  integrations: Integration[]
  isLoading?: boolean
}

export function IntegrationsPanel({ integrations, isLoading }: IntegrationsPanelProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!integrations.length) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-primary" />
            Integrations
          </CardTitle>
          <CardDescription>
            GitHub/GitLab connectors, CI status, deployment targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <Plug className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <h3 className="font-semibold text-lg">No integrations</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Connect GitHub or GitLab to sync repositories and view CI status.
            </p>
            <Button className="mt-4">
              <Plug className="h-4 w-4 mr-2" />
              Connect repository
            </Button>
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
          Integrations
        </CardTitle>
        <CardDescription>
          GitHub/GitLab connectors, CI status, deployment targets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {integrations.map((integration, idx) => (
            <div
              key={integration.id}
              className={cn(
                'rounded-xl border border-border p-4 transition-all duration-200',
                'hover:shadow-md hover:border-primary/30 hover:scale-[1.01]',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      integration.connected ? 'bg-success/10' : 'bg-muted/50'
                    )}
                  >
                    {integration.type === 'github' ? (
                      <Github className="h-5 w-5 text-foreground" />
                    ) : (
                      <Gitlab className="h-5 w-5 text-foreground" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{integration.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">
                      {integration.type}
                    </p>
                  </div>
                </div>
                {integration.connected ? (
                  <Badge variant="outline" className="gap-1 bg-success/10 text-success border-success/30">
                    <CheckCircle2 className="h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 text-muted-foreground">
                    <XCircle className="h-3 w-3" />
                    Disconnected
                  </Badge>
                )}
              </div>
              {integration.lastSync && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last sync: {new Date(integration.lastSync).toLocaleString()}
                </p>
              )}
              {!integration.connected && (
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
