import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Clock, CheckCircle, XCircle, Search } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { useCronjobs } from '@/hooks/use-cronjobs'
import type { CronjobItem } from '@/types/master-dashboard'
import { cn } from '@/lib/utils'

function CronjobsListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-border p-4"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24 mt-2" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-8 w-14 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CronjobRow({ job, index }: { job: CronjobItem; index: number }) {
  const badgeVariant =
    job.lastOutcome === 'success'
      ? 'success'
      : job.lastOutcome === 'failed'
        ? 'destructive'
        : 'secondary'

  return (
    <div
      key={job.id}
      className={cn(
        'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-border p-4',
        'transition-all duration-200 hover:bg-muted/30 hover:shadow-md hover:border-primary/20'
      )}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0"
          aria-hidden
        >
          <Clock className="h-5 w-5 text-primary" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="font-medium">{job.name}</p>
          <p className="text-sm text-muted-foreground">
            Next: {job.nextRun} • {job.schedule}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
        <Badge variant={badgeVariant} className="gap-1 shrink-0">
          {job.lastOutcome === 'success' ? (
            <CheckCircle className="h-3 w-3" aria-hidden />
          ) : job.lastOutcome === 'failed' ? (
            <XCircle className="h-3 w-3" aria-hidden />
          ) : null}
          {job.lastOutcome}
        </Badge>
        <Button variant="outline" size="sm" aria-label={`Edit cronjob ${job.name}`}>
          Edit
        </Button>
      </div>
    </div>
  )
}

export function CronjobsManager() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [createOpen, setCreateOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: cronjobs = [], isLoading, isError, error, refetch } = useCronjobs()

  const filteredCronjobs = searchQuery.trim()
    ? cronjobs.filter(
        (job) =>
          job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.schedule.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cronjobs

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      queueMicrotask(() => setCreateOpen(true))
      const next = new URLSearchParams(searchParams)
      next.delete('create')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Cronjobs Manager</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            CRUD and visualize Cronjobs as first-class objects
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg shrink-0"
          aria-label="Create new cronjob"
        >
          <Plus className="h-4 w-4 mr-2" aria-hidden />
          Create Cronjob
        </Button>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="create-cronjob-description">
          <DialogHeader>
            <DialogTitle>Create Cronjob</DialogTitle>
            <DialogDescription id="create-cronjob-description">
              Create a scheduled or event-driven multi-agent workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cronjob-name">Name</Label>
              <Input
                id="cronjob-name"
                placeholder="e.g. PR Triage"
                aria-describedby="cronjob-name-hint"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cronjob-schedule">Schedule (cron expression)</Label>
              <Input
                id="cronjob-schedule"
                placeholder="e.g. 0 2 * * *"
                aria-describedby="cronjob-schedule-hint"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              aria-label="Cancel creating cronjob"
            >
              Cancel
            </Button>
            <Button aria-label="Create cronjob">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="overflow-hidden border-border shadow-card transition-all duration-300">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 min-w-0">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                aria-hidden
              />
              <Input
                type="search"
                placeholder="Search cronjobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Search cronjobs by name or schedule"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <CronjobsListSkeleton />
          ) : isError ? (
            <ErrorState
              heading="Failed to load cronjobs"
              description={
                error instanceof Error ? error.message : 'Something went wrong. Please try again.'
              }
              onRetry={() => refetch()}
            />
          ) : filteredCronjobs.length === 0 ? (
            <EmptyState
              icon={Clock}
              heading={cronjobs.length === 0 ? 'No cronjobs yet' : 'No matching cronjobs'}
              description={
                cronjobs.length === 0
                  ? 'Create your first cronjob to automate recurring tasks. Cronjobs run on a schedule and appear here when configured.'
                  : `No cronjobs match "${searchQuery}". Try a different search.`
              }
              action={
                cronjobs.length === 0 ? (
                  <Button
                    onClick={() => setCreateOpen(true)}
                    className="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                    aria-label="Create your first cronjob"
                  >
                    <Plus className="h-4 w-4 mr-2" aria-hidden />
                    Create Cronjob
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredCronjobs.map((job, index) => (
                <CronjobRow key={job.id} job={job} index={index} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
