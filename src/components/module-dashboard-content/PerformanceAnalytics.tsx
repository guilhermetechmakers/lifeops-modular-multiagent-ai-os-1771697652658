import {
  BarChart3,
  TrendingUp,
  MousePointer,
  MessageCircle,
  ChevronUp,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { cn } from '@/lib/utils'
import type { PostPerformance } from '@/types/module-dashboard-content'

interface PerformanceAnalyticsProps {
  performance: PostPerformance[]
  isLoading?: boolean
}

export function PerformanceAnalytics({ performance, isLoading }: PerformanceAnalyticsProps) {
  const chartData = performance.map((p) => ({
    name: p.title.length > 15 ? p.title.slice(0, 15) + '…' : p.title,
    impressions: p.impressions ?? 0,
    engagement: p.engagement ?? 0,
    clicks: p.clicks ?? 0,
  }))

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (!performance.length) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Performance Analytics
          </CardTitle>
          <CardDescription>Post performance overview with feedback for future drafts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <h3 className="font-semibold text-lg">No data yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Publish content to see performance metrics and agent feedback for future drafts.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const avgImpressions = performance.reduce((a, p) => a + (p.impressions ?? 0), 0) / performance.length
  const avgEngagement = performance.reduce((a, p) => a + (p.engagement ?? 0), 0) / performance.length

  return (
    <Card
      className={cn(
        'overflow-hidden border-border/50 transition-all duration-300',
        'hover:shadow-card-hover hover:border-primary/20 animate-fade-in'
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Performance Analytics
        </CardTitle>
        <CardDescription>Post performance overview with feedback for future drafts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div
            className={cn(
              'rounded-lg border p-4 transition-all duration-200',
              'bg-gradient-to-br from-primary/10 to-transparent border-primary/20',
              'hover:shadow-md hover:scale-[1.02]'
            )}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Avg. Impressions</span>
            </div>
            <p className="text-2xl font-bold mt-2">{Math.round(avgImpressions).toLocaleString()}</p>
          </div>
          <div
            className={cn(
              'rounded-lg border p-4 transition-all duration-200',
              'bg-gradient-to-br from-accent/10 to-transparent border-accent/20',
              'hover:shadow-md hover:scale-[1.02]'
            )}
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Avg. Engagement</span>
            </div>
            <p className="text-2xl font-bold mt-2">{Math.round(avgEngagement)}</p>
          </div>
          <div
            className={cn(
              'rounded-lg border p-4 transition-all duration-200',
              'bg-gradient-to-br from-success/10 to-transparent border-success/20',
              'hover:shadow-md hover:scale-[1.02]'
            )}
          >
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-muted-foreground">Total Clicks</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {performance.reduce((a, p) => a + (p.clicks ?? 0), 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border p-4">
          <p className="text-sm font-medium mb-4">Performance by post</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" stroke="rgb(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="rgb(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--card))',
                    border: '1px solid rgb(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar dataKey="impressions" fill="rgb(var(--primary))" name="Impressions" radius={[4, 4, 0, 0]} />
                <Bar dataKey="engagement" fill="rgb(var(--accent))" name="Engagement" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clicks" fill="rgb(var(--success))" name="Clicks" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Agent feedback for future drafts</p>
          {performance.filter((p) => p.feedback).map((p) => (
            <div
              key={p.id}
              className={cn(
                'rounded-lg border p-3 transition-all duration-200',
                'bg-muted/20 border-border',
                'hover:border-primary/30'
              )}
            >
              <div className="flex items-start gap-2">
                <ChevronUp className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{p.feedback}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
