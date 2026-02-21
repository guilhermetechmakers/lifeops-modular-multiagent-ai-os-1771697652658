import { Watch, Calendar, Plug, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { DeviceIntegration } from '@/types/module-dashboard-health'

interface DeviceIntegrationsProps {
  integrations: DeviceIntegration[]
  isLoading?: boolean
}

const PROVIDER_ICONS: Record<string, typeof Watch> = {
  fitbit: Watch,
  garmin: Watch,
  apple_health: Watch,
  google_calendar: Calendar,
}

const PROVIDER_LABELS: Record<string, string> = {
  fitbit: 'Fitbit',
  garmin: 'Garmin',
  apple_health: 'Apple Health',
  google_calendar: 'Google Calendar',
}

const HEALTH_COLORS: Record<string, string> = {
  healthy: 'border-success/30 bg-success/10 text-success',
  degraded: 'border-warning/30 bg-warning/10 text-warning',
  error: 'border-destructive/30 bg-destructive/10 text-destructive',
}

export function DeviceIntegrations({ integrations, isLoading }: DeviceIntegrationsProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
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
            Device Integrations
          </CardTitle>
          <CardDescription>
            Connect fitness trackers and calendar for context
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <Plug className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <h3 className="font-semibold text-lg">No devices connected</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Connect Fitbit, Garmin, Apple Health, or Google Calendar for richer health data.
            </p>
            <Button className="mt-4 transition-all duration-200 hover:scale-[1.02]" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Connect device
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
          Device Integrations
        </CardTitle>
        <CardDescription>
          Connect fitness trackers and calendar for context
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration) => {
            const Icon = PROVIDER_ICONS[integration.provider] ?? Watch
            return (
              <div
                key={integration.id}
                className={cn(
                  'rounded-lg border p-4 transition-all duration-200',
                  'bg-gradient-to-br from-card to-muted/20 border-border/80',
                  'hover:shadow-md hover:scale-[1.01] hover:border-primary/30'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted/50 p-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {PROVIDER_LABELS[integration.provider] ?? integration.provider}
                        {integration.lastSync && (
                          <> · Last sync: {new Date(integration.lastSync).toLocaleDateString()}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      integration.connected ? HEALTH_COLORS[integration.health] : 'border-destructive/30 bg-destructive/10 text-destructive'
                    )}
                  >
                    {integration.connected ? integration.health : 'Disconnected'}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
        <Button variant="outline" className="w-full mt-4 transition-all duration-200 hover:scale-[1.01]" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Connect device
        </Button>
      </CardContent>
    </Card>
  )
}
