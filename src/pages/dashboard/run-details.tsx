import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  Activity,
  FileCode,
  Package,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { RunSummary } from '@/components/run-details-artifacts/RunSummary'
import { MessageTraceViewer } from '@/components/run-details-artifacts/MessageTraceViewer'
import { ActionDiffs } from '@/components/run-details-artifacts/ActionDiffs'
import { ArtifactsPanel } from '@/components/run-details-artifacts/ArtifactsPanel'
import { useRunDetailsArtifacts } from '@/hooks/use-run-details-artifacts'
import { cn } from '@/lib/utils'

function deriveProgressFromStatus(
  status: 'running' | 'completed' | 'failed' | 'pending_approval'
): number {
  switch (status) {
    case 'completed':
      return 100
    case 'failed':
      return 0
    case 'pending_approval':
      return 50
    case 'running':
    default:
      return 65
  }
}

function LogsSection({
  logs,
  isLoading,
}: {
  logs: string[]
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-5 w-full rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!logs || logs.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" aria-hidden />
            Logs
          </CardTitle>
          <CardDescription>Run execution log entries</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={FileText}
            heading="No logs available"
            description="Log entries for this run have not been captured yet."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" aria-hidden />
          Logs
          <Badge variant="secondary" className="font-normal">
            {logs.length} entries
          </Badge>
        </CardTitle>
        <CardDescription>Run execution log entries</CardDescription>
      </CardHeader>
      <CardContent>
        <pre
          className="rounded-lg bg-muted/50 p-4 text-sm overflow-auto max-h-48 font-mono text-foreground border border-border"
          role="log"
          aria-label="Run execution logs"
        >
          {logs.join('\n')}
        </pre>
      </CardContent>
    </Card>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function RunDetails() {
  const { runId } = useParams<{ runId: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useRunDetailsArtifacts(runId)

  const logs = data?.messages
    ? data.messages.map(
        (m) =>
          `[${new Date(m.timestamp).toISOString().replace('T', ' ').slice(0, 19)}] ${m.fromAgent} → ${m.toAgent}: ${m.content}`
      )
    : []

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard/overview')}
              aria-label="Back to dashboard overview"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Run Details
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Logs, inter-agent message trace, diffs, and reversible actions
              </p>
            </div>
          </div>
        </div>
        <ErrorState
          heading="Failed to load run details"
          description="We couldn't fetch the run data. Please check your connection and try again."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  if (isLoading && !data) {
    return <PageSkeleton />
  }

  const progress =
    data?.summary?.status != null
      ? deriveProgressFromStatus(data.summary.status)
      : 65

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between animate-fade-in">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard/overview')}
            className="transition-all duration-200 hover:scale-[1.02] hover:bg-muted"
            aria-label="Back to dashboard overview"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-accent">
                Run Details
              </span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Logs, inter-agent message trace, diffs, and reversible actions
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 self-start sm:self-center transition-all duration-200 hover:scale-[1.02]"
          asChild
        >
          <Link
            to={`/dashboard/run-details-artifacts/${runId ?? ''}`}
            aria-label="View full run details and artifacts"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Full artifacts
          </Link>
        </Button>
      </header>

      <section className="animate-fade-in" style={{ animationDelay: '75ms' }}>
        <RunSummary summary={data?.summary} isLoading={isLoading} />
      </section>

      <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <Card className="overflow-hidden border-l-4 border-l-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" aria-hidden />
              Progress
            </CardTitle>
            <CardDescription>
              Current run execution progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress
              value={progress}
              className="h-2 bg-muted"
              aria-label={`Run progress: ${progress}%`}
            />
          </CardContent>
        </Card>
      </section>

      <section className="animate-fade-in" style={{ animationDelay: '150ms' }}>
        <LogsSection logs={logs} isLoading={isLoading} />
      </section>

      <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <MessageTraceViewer messages={data?.messages} isLoading={isLoading} />
      </section>

      <section className="animate-fade-in" style={{ animationDelay: '250ms' }}>
        <ActionDiffs diffs={data?.diffs} isLoading={isLoading} />
      </section>

      <section
        className={cn(
          'grid gap-6 animate-fade-in',
          'lg:grid-cols-2'
        )}
        style={{ animationDelay: '300ms' }}
      >
        <ArtifactsPanel artifacts={data?.artifacts} isLoading={isLoading} />
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" aria-hidden />
              Quick actions
            </CardTitle>
            <CardDescription>
              View full artifacts, rollback, or export
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button
                variant="default"
                className="gap-2 transition-all duration-200 hover:scale-[1.02]"
                asChild
              >
                <Link
                  to={`/dashboard/run-details-artifacts/${runId ?? ''}`}
                  aria-label="View full run details and rollback options"
                >
                  <FileCode className="h-4 w-4" aria-hidden />
                  View full artifacts
                </Link>
              </Button>
              <Button
                variant="outline"
                className="gap-2 transition-all duration-200 hover:scale-[1.02]"
                onClick={() => navigate('/dashboard/overview')}
                aria-label="Return to dashboard overview"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to overview
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
