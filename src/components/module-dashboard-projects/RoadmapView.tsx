import { Calendar, MapPin, Bot, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Milestone } from '@/types/module-dashboard-projects'

interface RoadmapViewProps {
  milestones: Milestone[]
  isLoading?: boolean
}

export function RoadmapView({ milestones, isLoading }: RoadmapViewProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!milestones.length) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Roadmap
          </CardTitle>
          <CardDescription>
            Timeline with milestone creation and agent suggestions for tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <h3 className="font-semibold text-lg">No milestones yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Create milestones to start planning your roadmap. Agents can suggest tasks.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const statusColors = {
    planned: 'bg-muted/50 text-muted-foreground',
    'in-progress': 'bg-primary/20 text-primary',
    completed: 'bg-success/20 text-success',
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
          <MapPin className="h-5 w-5 text-primary" />
          Roadmap
        </CardTitle>
        <CardDescription>
          Timeline with milestone creation and agent suggestions for tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {milestones.map((milestone, idx) => (
            <div
              key={milestone.id}
              className={cn(
                'rounded-xl border border-border p-4 transition-all duration-200',
                'hover:shadow-md hover:border-primary/30',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Due {new Date(milestone.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(statusColors[milestone.status])}
                >
                  {milestone.status.replace('-', ' ')}
                </Badge>
              </div>
              <div className="mt-4 space-y-2">
                {milestone.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2',
                      'border border-border/50 bg-card/50',
                      'transition-all duration-200 hover:bg-secondary/50'
                    )}
                  >
                    {task.status === 'done' ? (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/50 shrink-0" />
                    )}
                    <span className="flex-1 text-sm">{task.title}</span>
                    {task.agentSuggested && (
                      <Badge variant="outline" className="gap-1 text-xs">
                        <Bot className="h-3 w-3" />
                        Agent
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs capitalize">
                      {task.status}
                    </Badge>
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
