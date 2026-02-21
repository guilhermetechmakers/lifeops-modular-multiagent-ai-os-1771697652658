import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RunSummary } from '@/components/run-details-artifacts/RunSummary'
import { MessageTraceViewer } from '@/components/run-details-artifacts/MessageTraceViewer'
import { ActionDiffs } from '@/components/run-details-artifacts/ActionDiffs'
import { ArtifactsPanel } from '@/components/run-details-artifacts/ArtifactsPanel'
import { RollbackControls } from '@/components/run-details-artifacts/RollbackControls'
import { useRunDetailsArtifacts, useRollbackPreview, useRollbackRun } from '@/hooks/use-run-details-artifacts'
import { cn } from '@/lib/utils'

function RunDetailsArtifactsPage() {
  const { runId } = useParams<{ runId: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useRunDetailsArtifacts(runId)
  const rollbackPreview = useRollbackPreview(runId)
  const rollbackRun = useRollbackRun(runId)

  useEffect(() => {
    const prevTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    document.title = `Run Details & Artifacts | LifeOps`
    if (meta) {
      meta.setAttribute('content', 'Detailed view for a single run: logs, inter-agent message trace, diffs, and reversible actions')
    }
    return () => {
      document.title = prevTitle
      if (meta) meta.setAttribute('content', prevDesc)
    }
  }, [])

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard/overview')}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Run Details & Artifacts</h1>
            <p className="text-muted-foreground mt-1">
              Logs, inter-agent message trace, diffs, and reversible actions
            </p>
          </div>
        </div>
        <div
          className={cn(
            'flex flex-col items-center justify-center py-16 rounded-2xl border border-destructive/30',
            'bg-destructive/5 transition-all duration-300 hover:border-destructive/40'
          )}
        >
          <AlertCircle className="h-12 w-12 text-destructive mb-4" aria-hidden />
          <h3 className="font-semibold text-lg">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mt-1">Failed to load run details.</p>
          <Button
            variant="outline"
            className="mt-4 transition-all duration-200 hover:scale-[1.02]"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard/overview')}
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-accent">
                Run Details & Artifacts
              </span>
            </h1>
            <p className="text-muted-foreground mt-1 text-base">
              Logs, inter-agent message trace, diffs, generated files and reversible actions
            </p>
          </div>
        </div>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <RunSummary summary={data?.summary} isLoading={isLoading} />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
        <MessageTraceViewer messages={data?.messages} isLoading={isLoading} />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <ActionDiffs diffs={data?.diffs} isLoading={isLoading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 animate-fade-in" style={{ animationDelay: '250ms' }}>
        <ArtifactsPanel artifacts={data?.artifacts} isLoading={isLoading} />
        <RollbackControls
          runId={runId ?? ''}
          canRollback={data?.canRollback}
          onPreview={() => rollbackPreview.mutateAsync()}
          onRollback={() => rollbackRun.mutateAsync()}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default RunDetailsArtifactsPage
