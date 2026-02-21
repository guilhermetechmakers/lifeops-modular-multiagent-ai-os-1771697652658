import { useNavigate } from 'react-router-dom'
import { Bot, GitBranch, FileCheck, Clock, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { SystemOverviewData, MetricTrend } from '@/types/master-dashboard'
import { chartColors } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

interface SystemOverviewProps {
  data?: SystemOverviewData
  isLoading?: boolean
}

type OverviewKey = 'activeAgents' | 'runningWorkflows' | 'pendingApprovals' | 'nextScheduledRuns'

const cards: Array<{
  key: OverviewKey
  title: string
  description: string
  icon: typeof Bot
  gradient: string
  href: string
  sparklineColor: string
}> = [
  { key: 'activeAgents', title: 'Active Agents', description: 'Running now', icon: Bot, gradient: 'from-primary/20 to-primary/5', href: '/dashboard/agent-directory', sparklineColor: chartColors.primary },
  { key: 'runningWorkflows', title: 'Running Workflows', description: 'In progress', icon: GitBranch, gradient: 'from-accent/20 to-accent/5', href: '/dashboard/templates', sparklineColor: chartColors.accent },
  { key: 'pendingApprovals', title: 'Pending Approvals', description: 'Awaiting review', icon: FileCheck, gradient: 'from-warning/20 to-warning/5', href: '/dashboard/approvals', sparklineColor: chartColors.warning },
  { key: 'nextScheduledRuns', title: 'Next Scheduled', description: 'Upcoming runs', icon: Clock, gradient: 'from-success/20 to-success/5', href: '/dashboard/cronjobs', sparklineColor: chartColors.success },
]

function TrendIndicator({ trend }: { trend: MetricTrend }) {
  const isUp = trend.change > 0
  const isDown = trend.change < 0
  const isNeutral = trend.change === 0

  if (isNeutral) {
    return (
      <span className="text-xs text-muted-foreground">{trend.previousPeriod}</span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-xs font-medium',
        isUp && 'text-success',
        isDown && 'text-destructive'
      )}
    >
      {isUp && <TrendingUp className="h-3 w-3" />}
      {isDown && <TrendingDown className="h-3 w-3" />}
      {trend.changePercent > 0 ? '+' : ''}{trend.changePercent}% {trend.previousPeriod}
    </span>
  )
}

function SparklineChart({ data, color, id }: { data: number[]; color: string; id: string }) {
  const chartData = data.map((value) => ({ value }))
  const gradientId = `sparkline-${id}`
  return (
    <div className="h-10 w-full min-w-[60px]" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SystemOverview({ data, isLoading }: SystemOverviewProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((_, i) => (
          <Card key={i} className="overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 75}ms` }}>
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
      {cards.map(({ key, title, description, icon: Icon, gradient, href, sparklineColor }, i) => {
        const value = data?.[key] ?? 0
        const trend = data?.trends?.[key]
        const sparkline = data?.sparklines?.[key]

        return (
          <Card
            key={key}
            role="button"
            tabIndex={0}
            onClick={() => navigate(href)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(href)}
            aria-label={`${title}: ${value} ${description}. Navigate to ${title}`}
            className={cn(
              'relative overflow-hidden border-border/50 transition-all duration-300 cursor-pointer',
              'hover:shadow-card-hover hover:scale-[1.02] hover:-translate-y-0.5 hover:border-primary/30',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'animate-fade-in'
            )}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none', gradient)} aria-hidden />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <div className="flex items-center gap-1">
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-end justify-between gap-2">
                <div className="text-2xl font-bold">{value}</div>
                {trend && <TrendIndicator trend={trend} />}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
              {sparkline && sparkline.length > 0 && (
                <div className="mt-3 opacity-80">
                  <SparklineChart data={sparkline} color={sparklineColor} id={key} />
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
