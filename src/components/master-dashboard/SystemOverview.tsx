import { Bot, GitBranch, FileCheck, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { SystemOverviewData } from '@/types/master-dashboard'
import { cn } from '@/lib/utils'

interface SystemOverviewProps {
  data?: SystemOverviewData
  isLoading?: boolean
}

const cards: Array<{
  key: keyof SystemOverviewData
  title: string
  description: string
  icon: typeof Bot
  gradient: string
}> = [
  { key: 'activeAgents', title: 'Active Agents', description: 'Running now', icon: Bot, gradient: 'from-primary/20 to-primary/5' },
  { key: 'runningWorkflows', title: 'Running Workflows', description: 'In progress', icon: GitBranch, gradient: 'from-accent/20 to-accent/5' },
  { key: 'pendingApprovals', title: 'Pending Approvals', description: 'Awaiting review', icon: FileCheck, gradient: 'from-amber-500/20 to-amber-500/5' },
  { key: 'nextScheduledRuns', title: 'Next Scheduled', description: 'Upcoming runs', icon: Clock, gradient: 'from-success/20 to-success/5' },
]

export function SystemOverview({ data, isLoading }: SystemOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, title, description, icon: Icon, gradient }, i) => (
        <Card
          key={key}
          className={cn(
            'overflow-hidden border-border/50 transition-all duration-300',
            'hover:shadow-card-hover hover:scale-[1.02] hover:-translate-y-0.5',
            'animate-fade-in'
          )}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', gradient)} aria-hidden />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{data?.[key] ?? 0}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
