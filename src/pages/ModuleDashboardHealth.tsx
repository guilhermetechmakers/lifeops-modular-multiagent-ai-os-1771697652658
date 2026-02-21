import { useEffect } from 'react'
import { useModuleDashboardHealth } from '@/hooks/use-module-dashboard-health'
import { HabitsGoals } from '@/components/module-dashboard-health/HabitsGoals'
import { TrainingPlans } from '@/components/module-dashboard-health/TrainingPlans'
import { NutritionPlanner } from '@/components/module-dashboard-health/NutritionPlanner'
import { RecoveryLoad } from '@/components/module-dashboard-health/RecoveryLoad'
import { DeviceIntegrations } from '@/components/module-dashboard-health/DeviceIntegrations'
import { Button } from '@/components/ui/button'
import { AlertCircle, Target, Dumbbell, Apple, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

function ModuleDashboardHealth() {
  const { data, isLoading, isError, refetch } = useModuleDashboardHealth()

  useEffect(() => {
    document.title = 'Module Dashboard — Health | LifeOps'
  }, [])

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Module Dashboard — Health</h1>
          <p className="text-muted-foreground mt-1">
            Manage habits, training/meal plans, recovery and workload balancing with agent coaching
          </p>
        </div>
        <div
          className={cn(
            'flex flex-col items-center justify-center py-16 rounded-2xl border border-destructive/30',
            'bg-destructive/5 transition-all duration-300 hover:border-destructive/40'
          )}
        >
          <AlertCircle className="h-12 w-12 text-destructive mb-4" aria-hidden />
          <h3 className="font-semibold text-lg">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Failed to load health module data.
          </p>
          <Button
            variant="outline"
            className="mt-4 transition-all duration-200 hover:scale-[1.02]"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const metrics = data?.metrics ?? {
    activeHabits: 0,
    trainingWeek: 0,
    nutritionAdherence: 0,
    recoveryStatus: '—',
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-accent">
            Module Dashboard — Health
          </span>
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          Manage habits, training/meal plans, recovery and workload balancing with agent coaching
        </p>
      </div>

      <div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in"
        style={{ animationDelay: '50ms' }}
      >
        <div
          className={cn(
            'rounded-xl border p-4 transition-all duration-200',
            'bg-gradient-to-br from-primary/10 to-transparent border-primary/20',
            'hover:shadow-md hover:scale-[1.02]'
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Active Habits</p>
            <Target className="h-5 w-5 text-primary/70" />
          </div>
          <p className="text-2xl font-bold mt-1">{metrics.activeHabits}</p>
        </div>
        <div
          className={cn(
            'rounded-xl border p-4 transition-all duration-200',
            'bg-gradient-to-br from-accent/10 to-transparent border-accent/20',
            'hover:shadow-md hover:scale-[1.02]'
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Training Plan</p>
            <Dumbbell className="h-5 w-5 text-accent/70" />
          </div>
          <p className="text-2xl font-bold mt-1">Week {metrics.trainingWeek || '—'}</p>
        </div>
        <div
          className={cn(
            'rounded-xl border p-4 transition-all duration-200',
            'bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20',
            'hover:shadow-md hover:scale-[1.02]'
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Nutrition</p>
            <Apple className="h-5 w-5 text-amber-500/70" />
          </div>
          <p className="text-2xl font-bold mt-1">{metrics.nutritionAdherence}%</p>
        </div>
        <div
          className={cn(
            'rounded-xl border p-4 transition-all duration-200',
            'bg-gradient-to-br from-success/10 to-transparent border-success/20',
            'hover:shadow-md hover:scale-[1.02]'
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Recovery</p>
            <Heart className="h-5 w-5 text-success/70" />
          </div>
          <p className="text-2xl font-bold mt-1 text-success">{metrics.recoveryStatus}</p>
        </div>
      </div>

      <div
        className="grid gap-6 lg:grid-cols-2 animate-fade-in"
        style={{ animationDelay: '100ms' }}
      >
        <HabitsGoals habits={data?.habits ?? []} isLoading={isLoading} />
        <TrainingPlans plans={data?.trainingPlans ?? []} isLoading={isLoading} />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
        <NutritionPlanner
          mealTemplates={data?.mealTemplates ?? []}
          macroTargets={data?.macroTargets ?? { calories: 0, protein: 0, carbs: 0, fat: 0, adherencePercent: 0 }}
          isLoading={isLoading}
        />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <RecoveryLoad metrics={data?.recoveryMetrics ?? []} isLoading={isLoading} />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '250ms' }}>
        <DeviceIntegrations integrations={data?.deviceIntegrations ?? []} isLoading={isLoading} />
      </div>
    </div>
  )
}

export { ModuleDashboardHealth }
export default ModuleDashboardHealth
