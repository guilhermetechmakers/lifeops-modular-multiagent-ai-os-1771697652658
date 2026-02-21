import { Check, X, Clock, CheckSquare, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { useApprovals } from '@/hooks/use-approvals'
import { cn } from '@/lib/utils'

export function ApprovalsQueue() {
  const {
    data: approvals = [],
    isLoading,
    isError,
    error,
    refetch,
    approve,
    reject,
    approvingId,
    rejectingId,
  } = useApprovals()

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Approvals Queue</h1>
        <p className="text-muted-foreground mt-1">
          Human-in-the-loop reviews for pending actions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>
            Review diffs, artifacts, and decide
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4" role="status" aria-live="polite" aria-label="Loading approvals">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState
              heading="Failed to load approvals"
              description={error instanceof Error ? error.message : 'Something went wrong. Please try again.'}
              onRetry={() => refetch()}
            />
          ) : approvals.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              heading="No pending approvals"
              description="All caught up! New actions requiring human review will appear here."
            />
          ) : (
            <div className="space-y-4" role="list" aria-label="Pending approvals list">
              {approvals.map((a, index) => (
                <div
                  key={a.id}
                  role="listitem"
                  className={cn(
                    'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-border p-4',
                    'transition-all duration-200 hover:bg-muted/30 hover:border-primary/20 hover:shadow-sm',
                    'animate-fade-in'
                  )}
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div>
                    <p className="font-medium">{a.action}</p>
                    <p className="text-sm text-muted-foreground">{a.agent}</p>
                    <Badge variant="secondary" className="mt-2" aria-label={`SLA: ${a.sla}`}>
                      <Clock className="h-3 w-3 mr-1" aria-hidden />
                      SLA: {a.sla}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reject(a.id)}
                      disabled={a.id === approvingId || a.id === rejectingId}
                      aria-label={`Reject approval for ${a.action}`}
                      aria-busy={a.id === rejectingId}
                      className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {a.id === rejectingId ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" aria-hidden />
                      ) : (
                        <X className="h-4 w-4 mr-1" aria-hidden />
                      )}
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => approve(a.id)}
                      disabled={a.id === approvingId || a.id === rejectingId}
                      aria-label={`Approve ${a.action}`}
                      aria-busy={a.id === approvingId}
                      className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {a.id === approvingId ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" aria-hidden />
                      ) : (
                        <Check className="h-4 w-4 mr-1" aria-hidden />
                      )}
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
