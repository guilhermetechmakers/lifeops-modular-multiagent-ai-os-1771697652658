import { GitBranch, FileText, Play, Link2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { PR } from '@/types/module-dashboard-projects'

interface PRReleasePaneProps {
  prs: PR[]
  isLoading?: boolean
}

export function PRReleasePane({ prs, isLoading }: PRReleasePaneProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!prs.length) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            PR & Release
          </CardTitle>
          <CardDescription>
            Linked PR automation, release notes generator, and CI pipeline triggers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <GitBranch className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <h3 className="font-semibold text-lg">No pull requests</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Open PRs will appear here. Generate release notes and trigger CI from this pane.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const statusStyles = {
    open: 'bg-primary/20 text-primary border-primary/30',
    merged: 'bg-success/20 text-success border-success/30',
    closed: 'bg-muted/50 text-muted-foreground border-border',
  }

  return (
    <Card
      className={cn(
        'overflow-hidden border-border/50 transition-all duration-300',
        'hover:shadow-card-hover hover:border-primary/20 animate-fade-in'
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          PR & Release
        </CardTitle>
        <CardDescription>
          Linked PR automation, release notes generator, and CI pipeline triggers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prs.map((pr, idx) => (
            <div
              key={pr.id}
              className={cn(
                'rounded-xl border border-border p-4 transition-all duration-200',
                'hover:shadow-md hover:border-primary/30',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{pr.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">
                    {pr.branch}
                  </p>
                  {pr.linkedTicketIds.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Link2 className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Linked to {pr.linkedTicketIds.length} ticket(s)
                      </span>
                    </div>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={cn('shrink-0', statusStyles[pr.status])}
                >
                  {pr.status}
                </Badge>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="gap-1">
                  <FileText className="h-3 w-3" />
                  Release notes
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Play className="h-3 w-3" />
                  Trigger CI
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
