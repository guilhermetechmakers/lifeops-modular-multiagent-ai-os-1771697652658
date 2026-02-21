import { useNavigate } from 'react-router-dom'
import { Play, Square, Check, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import type { ActiveRun } from '@/types/master-dashboard'
import { cn } from '@/lib/utils'

interface ActiveRunsFeedProps {
  runs?: ActiveRun[]
  isLoading?: boolean
}

function RunCard({ run }: { run: ActiveRun }) {
  const navigate = useNavigate()
  const isRunning = run.status === 'running'
  const needsApproval = run.status === 'pending_approval'

  return (
    <div
      className={cn(
        'rounded-xl border border-border p-4 transition-all duration-300',
        'hover:bg-muted/30 hover:shadow-md hover:border-primary/20'
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{run.name}</p>
            <Badge
              variant={
                isRunning ? 'secondary' : needsApproval ? 'warning' : run.status === 'failed' ? 'destructive' : 'success'
              }
              className="shrink-0"
            >
              {run.status.replace('_', ' ')}
            </Badge>
          </div>
          {run.logsPeek && (
            <p className="text-sm text-muted-foreground mt-1 truncate flex items-center gap-1">
              <FileText className="h-3 w-3 shrink-0" />
              {run.logsPeek}
            </p>
          )}
          {isRunning && run.progress !== undefined && (
            <div className="mt-2">
              <Progress value={run.progress} className="h-2" />
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {needsApproval && (
            <>
              <Button size="sm" variant="outline" className="gap-1">
                <Square className="h-4 w-4" />
                Decline
              </Button>
              <Button size="sm" className="gap-1">
                <Check className="h-4 w-4" />
                Approve
              </Button>
            </>
          )}
          {isRunning && (
            <Button size="sm" variant="outline" className="gap-1 text-destructive hover:text-destructive">
              <Square className="h-4 w-4" />
              Stop
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="gap-1"
            onClick={() => navigate(`/dashboard/runs/${run.id}`)}
          >
            <Play className="h-4 w-4" />
            Details
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ActiveRunsFeed({ runs = [], isLoading }: ActiveRunsFeedProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (runs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Runs Feed</CardTitle>
          <CardDescription>Real-time stream of executing runs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Play className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-semibold text-lg">No active runs</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Runs will appear here when Cronjobs or workflows are executing.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Active Runs Feed</CardTitle>
        <CardDescription>Real-time stream of executing runs with status, logs peek, and quick actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {runs.map((run) => (
            <RunCard key={run.id} run={run} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
