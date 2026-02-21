import { useQuery } from '@tanstack/react-query'
import { Activity, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigate } from 'react-router-dom'
import type { AuditItem } from '@/types/master-dashboard'
import { cn } from '@/lib/utils'

const MOCK_AUDIT: AuditItem[] = [
  { id: '1', action: 'Approved PR merge', entity: 'PR #234', timestamp: new Date().toISOString() },
  { id: '2', action: 'Created Cronjob', entity: 'Weekly Digest', timestamp: new Date().toISOString() },
  { id: '3', action: 'Agent enabled', entity: 'PR Triage', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '4', action: 'Workflow run completed', entity: 'Content Pipeline', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: '5', action: 'Connector updated', entity: 'GitHub', timestamp: new Date(Date.now() - 86400000).toISOString() },
]

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function AuditLogs() {
  const navigate = useNavigate()
  const { data: items = MOCK_AUDIT, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => MOCK_AUDIT,
    staleTime: 60 * 1000,
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">
            Full history of significant actions across agents, workflows, and Cronjobs
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard/overview')} className="gap-1 w-fit">
          <ChevronRight className="h-4 w-4 rotate-180" />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity History
          </CardTitle>
          <CardDescription>Recent significant actions across the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-semibold text-lg">No audit entries</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Significant actions will appear here for traceability.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border p-4',
                    'transition-all duration-300 hover:bg-muted/30 hover:border-primary/20'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.entity}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 sm:text-right">
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
