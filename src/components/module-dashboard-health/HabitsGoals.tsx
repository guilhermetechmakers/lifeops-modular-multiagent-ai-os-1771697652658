import { Target, Flame, Bell, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Habit } from '@/types/module-dashboard-health'

interface HabitsGoalsProps {
  habits: Habit[]
  isLoading?: boolean
}

export function HabitsGoals({ habits, isLoading }: HabitsGoalsProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!habits.length) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Habits & Goals
          </CardTitle>
          <CardDescription>
            Configurable habits, streaks, adherence metrics and reminders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <Target className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <h3 className="font-semibold text-lg">No habits yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Add habits to track streaks, adherence, and get reminders.
            </p>
            <Button className="mt-4 transition-all duration-200 hover:scale-[1.02]" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add habit
            </Button>
          </div>
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
          <Target className="h-5 w-5 text-primary" />
          Habits & Goals
        </CardTitle>
        <CardDescription>
          Configurable habits, streaks, adherence metrics and reminders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={cn(
                'rounded-lg border p-4 transition-all duration-200',
                'bg-gradient-to-br from-card to-muted/20 border-border/80',
                'hover:shadow-md hover:scale-[1.01] hover:border-primary/30'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium">{habit.name}</h4>
                    {habit.reminderTime && (
                      <Badge variant="outline" className="text-xs border-muted">
                        <Bell className="h-3 w-3 mr-1" />
                        {habit.reminderTime}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs border-primary/30 bg-primary/10 text-primary">
                      <Flame className="h-3 w-3 mr-1" />
                      {habit.currentStreak} day streak
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm mt-2 mb-1">
                    <span className="text-muted-foreground">
                      {habit.completedDays}/{habit.targetDaysPerWeek} days
                    </span>
                    <span className="font-medium">{habit.adherencePercent}% adherence</span>
                  </div>
                  <Progress value={habit.adherencePercent} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 transition-all duration-200 hover:scale-[1.01]" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add habit
        </Button>
      </CardContent>
    </Card>
  )
}
