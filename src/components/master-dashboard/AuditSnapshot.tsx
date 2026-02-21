import { useNavigate } from 'react-router-dom'
import { Activity, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-56 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
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
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground mb-4 opacity-50" aria-hidden />
            <h3 className="font-semibold text-lg">No recent activity</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Significant actions will appear here for quick reference.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard/audit')}>
              View full audit logs
            </Button>
          </div>
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
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/audit')} className="gap-1">
          Full logs
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex items-center justify-between rounded-lg border border-border p-3',
                'transition-all duration-300 hover:bg-muted/30 hover:border-primary/20'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Activity className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.entity}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0 ml-2">{formatTimestamp(item.timestamp)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
