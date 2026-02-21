import { useEffect } from 'react'
import { useModuleDashboardContent, useScheduleContentToSlot } from '@/hooks/use-module-dashboard-content'
import { ContentCalendar } from '@/components/module-dashboard-content/ContentCalendar'
import { IdeaInbox } from '@/components/module-dashboard-content/IdeaInbox'
import { EditorWorkspace } from '@/components/module-dashboard-content/EditorWorkspace'
import { PublishingConnectors } from '@/components/module-dashboard-content/PublishingConnectors'
import { PerformanceAnalytics } from '@/components/module-dashboard-content/PerformanceAnalytics'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function ModuleDashboardContent() {
  const { data, isLoading, isError, refetch } = useModuleDashboardContent()
  const scheduleMutation = useScheduleContentToSlot()

  useEffect(() => {
    document.title = 'Module Dashboard — Content | LifeOps'
  }, [])

  const handleSlotDrop = (slotId: string, contentId: string) => {
    scheduleMutation.mutate(
      { slotId, contentId },
      {
        onSuccess: () => toast.success('Content scheduled'),
        onError: () => toast.error('Failed to schedule content'),
      }
    )
  }

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Module Dashboard — Content</h1>
          <p className="text-muted-foreground mt-1">
            End-to-end content pipeline for idea→research→draft→edit→schedule→publish
          </p>
        </div>
        <div
          className={cn(
            'flex flex-col items-center justify-center py-16 rounded-2xl border border-destructive/30',
            'bg-destructive/5 transition-all duration-300 hover:border-destructive/40'
          )}
        >
          <AlertCircle className="h-12 w-12 text-destructive mb-4" aria-hidden />
          <h3 className="font-semibold text-lg">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Failed to load content module data.
          </p>
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

  const metrics = data?.metrics ?? { drafts: 0, scheduled: 0, ideaInbox: 0, published: 0 }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-accent">
            Module Dashboard — Content
          </span>
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          End-to-end content pipeline for idea→research→draft→edit→schedule→publish with multi-agent collaboration
        </p>
      </div>

      <div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in"
        style={{ animationDelay: '50ms' }}
      >
        <div
          className={cn(
            'rounded-xl border p-4 transition-all duration-200',
            'bg-gradient-to-br from-primary/10 to-transparent border-primary/20',
            'hover:shadow-md hover:scale-[1.02]'
          )}
        >
          <p className="text-sm font-medium text-muted-foreground">Drafts</p>
          <p className="text-2xl font-bold mt-1">{metrics.drafts}</p>
        </div>
        <div
          className={cn(
            'rounded-xl border p-4 transition-all duration-200',
            'bg-gradient-to-br from-accent/10 to-transparent border-accent/20',
            'hover:shadow-md hover:scale-[1.02]'
          )}
        >
          <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
          <p className="text-2xl font-bold mt-1">{metrics.scheduled}</p>
        </div>
        <div
          className={cn(
            'rounded-xl border p-4 transition-all duration-200',
            'bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20',
            'hover:shadow-md hover:scale-[1.02]'
          )}
        >
          <p className="text-sm font-medium text-muted-foreground">Idea Inbox</p>
          <p className="text-2xl font-bold mt-1">{metrics.ideaInbox}</p>
        </div>
        <div
          className={cn(
            'rounded-xl border p-4 transition-all duration-200',
            'bg-gradient-to-br from-success/10 to-transparent border-success/20',
            'hover:shadow-md hover:scale-[1.02]'
          )}
        >
          <p className="text-sm font-medium text-muted-foreground">Published</p>
          <p className="text-2xl font-bold mt-1">{metrics.published}</p>
        </div>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <ContentCalendar
          slots={data?.calendarSlots ?? []}
          ideas={data?.ideas ?? []}
          onSlotDrop={handleSlotDrop}
          isLoading={isLoading}
        />
      </div>

      <div
        className="grid gap-6 lg:grid-cols-2 animate-fade-in"
        style={{ animationDelay: '150ms' }}
      >
        <IdeaInbox ideas={data?.ideas ?? []} isLoading={isLoading} />
        <EditorWorkspace drafts={data?.drafts ?? []} isLoading={isLoading} />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <PublishingConnectors connectors={data?.connectors ?? []} isLoading={isLoading} />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '250ms' }}>
        <PerformanceAnalytics performance={data?.performance ?? []} isLoading={isLoading} />
      </div>
    </div>
  )
}

export { ModuleDashboardContent }
export default ModuleDashboardContent
