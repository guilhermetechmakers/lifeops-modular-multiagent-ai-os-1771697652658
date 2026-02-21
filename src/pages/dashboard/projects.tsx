import { FolderKanban, GitBranch, Calendar, LayoutGrid, Plus, ListTodo } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { useProjectsDashboard } from '@/hooks/use-projects-dashboard'
import { cn } from '@/lib/utils'
import type { Ticket } from '@/types/module-dashboard-projects'

const BOARD_COLUMNS: { key: Ticket['status']; label: string; color: string }[] = [
  { key: 'todo', label: 'To Do', color: 'border-border' },
  { key: 'in-progress', label: 'In Progress', color: 'border-primary/30' },
  { key: 'review', label: 'Review', color: 'border-warning/30' },
  { key: 'done', label: 'Done', color: 'border-success/30' },
]

function TicketColumnEmptyState({ columnLabel }: { columnLabel: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-8 text-center rounded-lg border border-dashed border-border bg-muted/20 min-h-[120px]"
      role="status"
      aria-label={`${columnLabel} column is empty`}
    >
      <ListTodo className="h-8 w-8 text-muted-foreground mb-2" aria-hidden />
      <p className="text-sm text-muted-foreground">No tickets</p>
    </div>
  )
}

function MetricCardSkeleton() {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-12" />
      </CardContent>
    </Card>
  )
}

function TicketBoardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" aria-busy="true" aria-label="Loading ticket board">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-64 rounded-lg min-h-[200px]" />
      ))}
    </div>
  )
}

export function ProjectsDashboard() {
  const { data, isLoading, isError, refetch } = useProjectsDashboard()

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Developer-centric automation: roadmaps, tickets, CI
          </p>
        </div>
        <ErrorState
          heading="Failed to load projects"
          description="We couldn't load your project data. Please check your connection and try again."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const tickets = data?.tickets ?? []
  const hasAnyTickets = tickets.length > 0

  return (
    <div className="space-y-8 animate-fade-in" aria-busy={isLoading} aria-label="Projects Dashboard">
      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Projects</h1>
        <p className="text-muted-foreground mt-1">
          Developer-centric automation: roadmaps, tickets, CI
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {isLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <Card className="border-border/50 transition-all duration-300 hover:shadow-card hover:border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.activeProjects ?? 0}</div>
              </CardContent>
            </Card>
            <Card className="border-border/50 transition-all duration-300 hover:shadow-card hover:border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Open PRs</CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.openPRs ?? 0}</div>
              </CardContent>
            </Card>
            <Card className="border-border/50 transition-all duration-300 hover:shadow-card hover:border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Sprint Progress</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.sprintProgress ?? 0}%</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card className="border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" aria-hidden />
            Ticket Board
          </CardTitle>
          <CardDescription>Kanban with auto-triage</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="board">
            <TabsList className="grid w-full grid-cols-3" aria-label="Ticket board views">
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="pr">PR & Release</TabsTrigger>
            </TabsList>
            <TabsContent value="board" className="mt-4">
              {isLoading ? (
                <TicketBoardSkeleton />
              ) : !hasAnyTickets ? (
                <EmptyState
                  icon={LayoutGrid}
                  heading="No tickets yet"
                  description="Create tickets or let agents suggest them based on your backlog."
                  action={
                    <Button
                      className="transition-all duration-200 hover:scale-[1.02]"
                      size="sm"
                      aria-label="Add first ticket"
                    >
                      <Plus className="h-4 w-4 mr-2" aria-hidden />
                      Add first ticket
                    </Button>
                  }
                  className="rounded-lg border border-dashed border-border py-16"
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {BOARD_COLUMNS.map((col) => {
                    const columnTickets = tickets.filter((t) => t.status === col.key)
                    return (
                      <div
                        key={col.key}
                        className={cn(
                          'rounded-lg border p-4 min-h-[200px] transition-all duration-200',
                          col.color,
                          'bg-card/30 hover:border-primary/20'
                        )}
                        role="region"
                        aria-label={`${col.label} column with ${columnTickets.length} tickets`}
                      >
                        <h3 className="font-medium mb-4 flex items-center gap-2">
                          {col.label}
                          <Badge variant="secondary" className="text-xs">
                            {columnTickets.length}
                          </Badge>
                        </h3>
                        {columnTickets.length === 0 ? (
                          <TicketColumnEmptyState columnLabel={col.label} />
                        ) : (
                          <div className="space-y-2">
                            {columnTickets.map((t) => (
                              <div
                                key={t.id}
                                className={cn(
                                  'rounded-lg p-3 mb-2 border transition-all duration-200',
                                  'bg-card border-border hover:shadow-md hover:border-primary/30 hover:scale-[1.01]',
                                  t.status === 'done' && 'opacity-75'
                                )}
                                role="article"
                                aria-label={`Ticket: ${t.title}, priority ${t.priority}`}
                              >
                                <p className="text-sm font-medium">{t.title}</p>
                                <Badge
                                  variant={t.priority === 'high' ? 'destructive' : 'secondary'}
                                  className="mt-2 text-xs"
                                >
                                  {t.priority}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
            <TabsContent value="roadmap" className="mt-4">
              <p className="text-muted-foreground">Roadmap timeline view</p>
            </TabsContent>
            <TabsContent value="pr" className="mt-4">
              <p className="text-muted-foreground">PR & Release pane</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
