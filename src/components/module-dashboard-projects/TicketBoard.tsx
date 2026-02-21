import { LayoutGrid, Bot, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Ticket } from '@/types/module-dashboard-projects'

interface TicketBoardProps {
  tickets: Ticket[]
  isLoading?: boolean
}

const COLUMNS = [
  { key: 'todo' as const, label: 'To Do', color: 'border-muted/50' },
  { key: 'in-progress' as const, label: 'In Progress', color: 'border-primary/30' },
  { key: 'review' as const, label: 'Review', color: 'border-warning/30' },
  { key: 'done' as const, label: 'Done', color: 'border-success/30' },
]

export function TicketBoard({ tickets, isLoading }: TicketBoardProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!tickets.length) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Ticket Board
          </CardTitle>
          <CardDescription>
            Kanban with agent suggested tickets and auto-triage tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <LayoutGrid className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <h3 className="font-semibold text-lg">No tickets yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Create tickets or let agents suggest them based on your backlog.
            </p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add first ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getTicketsByColumn = (key: Ticket['status']) =>
    tickets.filter((t) => t.status === key)

  return (
    <Card
      className={cn(
        'overflow-hidden border-border/50 transition-all duration-300',
        'hover:shadow-card-hover hover:border-primary/20 animate-fade-in'
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          Ticket Board
        </CardTitle>
        <CardDescription>
          Kanban with agent suggested tickets and auto-triage tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4 overflow-x-auto pb-2">
          {COLUMNS.map((col) => (
            <div
              key={col.key}
              className={cn(
                'min-w-[200px] rounded-lg border p-4',
                col.color,
                'bg-card/30 transition-all duration-200'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-sm">{col.label}</h4>
                <Badge variant="secondary" className="text-xs">
                  {getTicketsByColumn(col.key).length}
                </Badge>
              </div>
              <div className="space-y-2">
                {getTicketsByColumn(col.key).map((ticket) => (
                  <div
                    key={ticket.id}
                    className={cn(
                      'rounded-lg border border-border p-3 transition-all duration-200',
                      'hover:shadow-md hover:border-primary/30 hover:scale-[1.01]',
                      'cursor-pointer'
                    )}
                  >
                    <p className="text-sm font-medium">{ticket.title}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge
                        variant={
                          ticket.priority === 'high' ? 'destructive' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {ticket.priority}
                      </Badge>
                      {ticket.agentSuggested && (
                        <Badge variant="outline" className="gap-1 text-xs">
                          <Bot className="h-3 w-3" />
                          Agent
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
