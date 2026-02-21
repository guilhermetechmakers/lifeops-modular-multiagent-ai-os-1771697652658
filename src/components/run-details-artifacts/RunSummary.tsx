import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock, CreditCard, User, Calendar } from 'lucide-react'
import type { RunSummaryData } from '@/types/run-details-artifacts'

interface RunSummaryProps {
  summary?: RunSummaryData
  isLoading?: boolean
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  running: 'secondary',
  completed: 'default',
  failed: 'destructive',
  pending_approval: 'outline',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function RunSummary({ summary, isLoading }: RunSummaryProps) {
  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((_, idx) => (
              <Skeleton key={idx} className="h-20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!summary) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mb-4 opacity-50" aria-hidden />
          <h3 className="font-semibold text-lg">No run summary</h3>
          <p className="text-sm text-muted-foreground mt-1">Run details could not be loaded.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in overflow-hidden border-l-4 border-l-primary/50">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-xl">{summary.name}</CardTitle>
          <Badge variant={statusVariant[summary.status] ?? 'secondary'}>
            {summary.status.replace('_', ' ')}
          </Badge>
        </div>
        <CardDescription>Status, times, initiator, and cost estimate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-muted/50 p-4 transition-all duration-200 hover:bg-muted/70">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Start</span>
            </div>
            <p className="mt-1 font-medium">{formatDate(summary.startedAt)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4 transition-all duration-200 hover:bg-muted/70">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">End</span>
            </div>
            <p className="mt-1 font-medium">
              {summary.endedAt ? formatDate(summary.endedAt) : '—'}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4 transition-all duration-200 hover:bg-muted/70">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Initiator</span>
            </div>
            <p className="mt-1 font-medium capitalize">{summary.initiator}</p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4 transition-all duration-200 hover:from-primary/15 hover:to-accent/15">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Credits</span>
            </div>
            <p className="mt-1 font-medium">
              {summary.consumedCredits != null
                ? `${summary.consumedCredits} credits`
                : summary.costEstimate != null
                  ? `~${summary.costEstimate} est.`
                  : '—'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
