import { Moon, Activity, Scale, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { RecoveryMetric } from '@/types/module-dashboard-health'

interface RecoveryLoadProps {
  metrics: RecoveryMetric[]
  isLoading?: boolean
}

const STATUS_COLORS: Record<string, string> = {
  good: 'border-success/30 bg-success/10 text-success',
  fair: 'border-warning/30 bg-warning/10 text-warning',
  poor: 'border-destructive/30 bg-destructive/10 text-destructive',
}

const METRIC_ICONS: Record<string, typeof Moon> = {
  sleep: Moon,
  hrv: Activity,
  workload: Scale,
}

export function RecoveryLoad({ metrics, isLoading }: RecoveryLoadProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!metrics.length) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            Recovery & Load
          </CardTitle>
          <CardDescription>
            Sleep, HRV, and workload balancing suggestions with safety constraints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <Moon className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <h3 className="font-semibold text-lg">No recovery data</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Connect a fitness tracker to see sleep, HRV, and workload insights.
            </p>
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
          <Moon className="h-5 w-5 text-primary" />
          Recovery & Load
        </CardTitle>
        <CardDescription>
          Sleep, HRV, and workload balancing suggestions with safety constraints
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = METRIC_ICONS[metric.type] ?? Activity
            return (
              <div
                key={metric.id}
                className={cn(
                  'rounded-lg border p-4 transition-all duration-200',
                  'bg-gradient-to-br from-card to-muted/20',
                  'hover:shadow-md hover:scale-[1.02] hover:border-primary/30',
                  STATUS_COLORS[metric.status] ?? 'border-border/80'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{metric.label}</span>
                </div>
                <p className="text-2xl font-bold">{metric.value}</p>
                {metric.suggestion && (
                  <div className="flex items-start gap-1.5 mt-2 text-xs">
                    <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{metric.suggestion}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
