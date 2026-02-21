import { Dumbbell, Calendar, ChevronRight, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'
import type { TrainingPlan } from '@/types/module-dashboard-health'

interface TrainingPlansProps {
  plans: TrainingPlan[]
  isLoading?: boolean
}

export function TrainingPlans({ plans, isLoading }: TrainingPlansProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!plans.length) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            Training Plans
          </CardTitle>
          <CardDescription>
            Periodized plans generated from goals, with calendar sync and progress tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Dumbbell}
            heading="No training plans"
            description="Create a periodized plan from your goals with calendar sync."
            action={
              <Button className="transition-all duration-200 hover:scale-[1.02]" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create plan
              </Button>
            }
            className="rounded-lg border border-dashed border-border py-16"
          />
        </CardContent>
      </Card>
    )
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
          <Dumbbell className="h-5 w-5 text-primary" />
          Training Plans
        </CardTitle>
        <CardDescription>
          Periodized plans generated from goals, with calendar sync and progress tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {plans.map((plan, idx) => (
            <div
              key={plan.id}
              className={cn(
                'animate-fade-in',
                'rounded-lg border p-4 transition-all duration-200',
                'bg-gradient-to-br from-card to-muted/20 border-border/80',
                'hover:shadow-md hover:scale-[1.01] hover:border-primary/30'
              )}
              style={{ animationDelay: `${idx * 75}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium">{plan.name}</h4>
                    <Badge variant="outline" className="text-xs border-accent/30 bg-accent/10 text-accent">
                      {plan.phase}
                    </Badge>
                    {plan.calendarSynced && (
                      <Badge variant="outline" className="text-xs border-success/30 bg-success/10 text-success">
                        <Calendar className="h-3 w-3 mr-1" />
                        Synced
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Week {plan.weekNumber} of {plan.totalWeeks}
                  </p>
                  <div className="flex justify-between text-sm mt-2 mb-1">
                    <span className="text-muted-foreground">
                      {plan.completedSessions}/{plan.sessionsThisWeek} sessions
                    </span>
                    {plan.nextSession && (
                      <span className="font-medium text-primary">{plan.nextSession}</span>
                    )}
                  </div>
                  <Progress
                    value={(plan.completedSessions / plan.sessionsThisWeek) * 100}
                    className="h-2"
                  />
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 transition-all duration-200 hover:scale-[1.01]" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create plan
        </Button>
      </CardContent>
    </Card>
  )
}
