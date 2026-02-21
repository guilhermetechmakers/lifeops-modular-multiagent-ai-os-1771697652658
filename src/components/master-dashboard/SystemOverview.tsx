import { useNavigate } from 'react-router-dom'
import { Bot, GitBranch, FileCheck, Clock, ChevronRight } from 'lucide-react'
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
  href: string
}> = [
  { key: 'activeAgents', title: 'Active Agents', description: 'Running now', icon: Bot, gradient: 'from-primary/20 to-primary/5', href: '/dashboard/agents' },
  { key: 'runningWorkflows', title: 'Running Workflows', description: 'In progress', icon: GitBranch, gradient: 'from-accent/20 to-accent/5', href: '/dashboard/templates' },
  { key: 'pendingApprovals', title: 'Pending Approvals', description: 'Awaiting review', icon: FileCheck, gradient: 'from-amber-500/20 to-amber-500/5', href: '/dashboard/approvals' },
  { key: 'nextScheduledRuns', title: 'Next Scheduled', description: 'Upcoming runs', icon: Clock, gradient: 'from-success/20 to-success/5', href: '/dashboard/cronjobs' },
]

export function SystemOverview({ data, isLoading }: SystemOverviewProps) {
  const navigate = useNavigate()

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
      {cards.map(({ key, title, description, icon: Icon, gradient, href }, i) => (
        <Card
          key={key}
          role="button"
          tabIndex={0}
          onClick={() => navigate(href)}
          onKeyDown={(e) => e.key === 'Enter' && navigate(href)}
          className={cn(
            'overflow-hidden border-border/50 transition-all duration-300 cursor-pointer',
            'hover:shadow-card-hover hover:scale-[1.02] hover:-translate-y-0.5 hover:border-primary/30',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'animate-fade-in'
          )}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', gradient)} aria-hidden />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className="flex items-center gap-1">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
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
