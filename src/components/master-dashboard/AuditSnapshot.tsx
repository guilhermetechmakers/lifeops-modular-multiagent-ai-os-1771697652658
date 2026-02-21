import { useNavigate } from 'react-router-dom'
import { Activity, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import type { AuditItem } from '@/types/master-dashboard'
import { cn } from '@/lib/utils'

interface AuditSnapshotProps {
  items?: AuditItem[]
  isLoading?: boolean
}

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return d.toLocaleDateString()
}

export function AuditSnapshot({ items = [], isLoading }: AuditSnapshotProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-56 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg animate-fade-in" style={{ animationDelay: `${i * 75}ms` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Audit Snapshot</CardTitle>
          <CardDescription>Recent significant actions</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Activity}
            heading="No recent activity"
            description="Significant actions will appear here for quick reference."
            action={
              <Button variant="outline" onClick={() => navigate('/dashboard/audit')} aria-label="View full audit logs">
                View full audit logs
              </Button>
            }
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Audit Snapshot</CardTitle>
          <CardDescription>Recent significant actions and quick links to full audit logs</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/audit')} className="gap-1" aria-label="View full audit logs">
          Full logs
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/dashboard/audit?entity=${encodeURIComponent(item.entity)}`)}
              aria-label={`View audit details for ${item.entity}`}
              className={cn(
                'w-full flex items-center justify-between rounded-lg border border-border p-3 text-left',
                'transition-all duration-300 hover:bg-muted/30 hover:border-primary/20 hover:shadow-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Activity className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.entity}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0 ml-2">{formatTimestamp(item.timestamp)}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
