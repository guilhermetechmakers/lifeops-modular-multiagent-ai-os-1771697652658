import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, CheckCircle, XCircle, Calendar, List } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import type { CronjobItem } from '@/types/master-dashboard'
import { cn } from '@/lib/utils'

interface CronjobsTimelineProps {
  cronjobs?: CronjobItem[]
  isLoading?: boolean
}

function CronjobsList({ cronjobs, onToggle }: { cronjobs: CronjobItem[]; onToggle?: (job: CronjobItem, enabled: boolean) => void }) {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({})

  const handleToggle = (job: CronjobItem, enabled: boolean) => {
    setOverrides((prev) => ({ ...prev, [job.id]: enabled }))
    onToggle?.(job, enabled)
    toast.success(enabled ? `${job.name} enabled` : `${job.name} disabled`)
  }

  const getEnabled = (job: CronjobItem) => (job.id in overrides ? overrides[job.id] : job.enabled)

  if (cronjobs.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        heading="No scheduled Cronjobs"
        description="Create your first Cronjob to automate recurring tasks."
        action={
          <Button asChild>
            <Link to="/dashboard/cronjobs?create=true">Create Cronjob</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-3">
      {cronjobs.map((job, i) => (
        <div
          key={job.id}
          className={cn(
            'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border p-4',
            'transition-all duration-300 hover:bg-muted/30 hover:shadow-md hover:border-primary/20',
            'animate-fade-in'
          )}
          style={{ animationDelay: `${i * 75}ms` }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{job.name}</p>
              <p className="text-sm text-muted-foreground">
                Next: {job.nextRun} • {job.schedule}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Badge
              variant={job.lastOutcome === 'success' ? 'success' : job.lastOutcome === 'failed' ? 'destructive' : 'secondary'}
              className="gap-1"
            >
              {job.lastOutcome === 'success' ? (
                <CheckCircle className="h-3 w-3" />
              ) : job.lastOutcome === 'failed' ? (
                <XCircle className="h-3 w-3" />
              ) : null}
              {job.lastOutcome}
            </Badge>
            <div className="flex items-center gap-2">
              <Switch
                checked={getEnabled(job)}
                onCheckedChange={(checked) => handleToggle(job, checked)}
                aria-label={`Toggle ${job.name}`}
              />
              <span className="text-xs text-muted-foreground">{getEnabled(job) ? 'On' : 'Off'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function CronjobsCalendar({ cronjobs }: { cronjobs: CronjobItem[] }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7

  const getRunsForDay = (day: number) => {
    if (day < 1 || day > daysInMonth) return []
    return cronjobs.filter((c) => {
      const dayOfWeek = (startOffset + day - 1) % 7
      if (c.nextRun.includes('Mon') && dayOfWeek === 0) return true
      if (c.nextRun.includes('2:00') && day === now.getDate()) return true
      if (c.nextRun.includes('9:00') && day <= 7) return true
      if (c.nextRun.includes('1st') && day === 1) return true
      return false
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {days.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: totalCells }, (_, i) => {
          const dayNum = i - startOffset + 1
          const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth
          const isToday = isCurrentMonth && dayNum === now.getDate()
          const runs = isCurrentMonth ? getRunsForDay(dayNum) : []

          return (
            <div
              key={i}
              className={cn(
                'aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all duration-200',
                'hover:bg-muted/50 min-h-[36px]',
                isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/50',
                isToday && 'bg-primary/20 text-primary font-semibold ring-2 ring-primary/40',
                runs.length > 0 && isCurrentMonth && !isToday && 'bg-accent/10'
              )}
            >
              <span>{isCurrentMonth ? dayNum : ''}</span>
              {runs.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" aria-hidden />
              )}
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {cronjobs.filter((c) => c.enabled).length} Cronjobs scheduled this month
        </p>
        <Link
          to="/dashboard/cronjobs"
          className="text-xs font-medium text-primary hover:underline transition-colors"
        >
          View all
        </Link>
      </div>
    </div>
  )
}

export function CronjobsTimeline({ cronjobs = [], isLoading }: CronjobsTimelineProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list')

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl animate-fade-in" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in">
      <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'calendar')}>
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Cronjobs Timeline</CardTitle>
              <CardDescription>Scheduled Cronjobs with next run and last outcome</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/cronjobs">View Cronjobs Manager</Link>
              </Button>
              <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  List
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="list" className="mt-0">
            <CronjobsList cronjobs={cronjobs} onToggle={() => {}} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            <CronjobsCalendar cronjobs={cronjobs} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
