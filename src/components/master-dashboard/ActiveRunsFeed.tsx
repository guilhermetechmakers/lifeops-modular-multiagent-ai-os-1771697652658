import { Link, useNavigate } from 'react-router-dom'
import { Play, Square, Check, FileText, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useCicdRetryRun } from '@/hooks/use-cicd-provider'
import type { ActiveRun } from '@/types/master-dashboard'
import type { CicdProvider } from '@/types/cicd-provider'
import { cn } from '@/lib/utils'

interface ActiveRunsFeedProps {
  runs?: ActiveRun[]
  isLoading?: boolean
}

function RunCard({ run }: { run: ActiveRun }) {
  const navigate = useNavigate()
  const retryMutation = useCicdRetryRun()
  const isRunning = run.status === 'running'
  const needsApproval = run.status === 'pending_approval'
  const isFailed = run.status === 'failed'
  const hasCicd = run.cicdProvider && run.cicdRunId

  const handleStop = () => {
    toast.success(`Stopping ${run.name}...`)
  }

  const handleApprove = () => {
    toast.success(`${run.name} approved`)
    navigate('/dashboard/approvals')
  }

  const handleDecline = () => {
    toast.info(`${run.name} declined`)
  }

  const handleCicdRetry = () => {
    if (hasCicd) {
      retryMutation.mutate({
        provider: run.cicdProvider as CicdProvider,
        runId: run.cicdRunId!,
      })
    } else {
      toast.info('Retry via Cronjobs Manager')
    }
  }

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
              <Button size="sm" variant="outline" className="gap-1" onClick={handleDecline}>
                <Square className="h-4 w-4" />
                Decline
              </Button>
              <Button size="sm" className="gap-1" onClick={handleApprove}>
                <Check className="h-4 w-4" />
                Approve
              </Button>
            </>
          )}
          {isRunning && (
            <Button size="sm" variant="outline" className="gap-1 text-destructive hover:text-destructive" onClick={handleStop}>
              <Square className="h-4 w-4" />
              Stop
            </Button>
          )}
          {isFailed && hasCicd && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={handleCicdRetry}
              disabled={retryMutation.isPending}
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="gap-1"
            asChild
          >
            <Link to={`/dashboard/run-details-artifacts/${run.id}`} className="inline-flex items-center gap-1">
              <Play className="h-4 w-4" />
              Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ActiveRunsFeed({ runs = [], isLoading }: ActiveRunsFeedProps) {
  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl animate-fade-in" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (runs.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Active Runs Feed</CardTitle>
          <CardDescription>Real-time stream of executing runs</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Play}
            heading="No active runs"
            description="Runs will appear here when Cronjobs or workflows are executing."
            action={
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/cronjobs">View Cronjobs</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/dashboard/templates">View Workflows</Link>
                </Button>
              </>
            }
          />
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
          {runs.map((run, i) => (
            <div key={run.id} className="animate-fade-in" style={{ animationDelay: `${i * 75}ms` }}>
              <RunCard run={run} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
