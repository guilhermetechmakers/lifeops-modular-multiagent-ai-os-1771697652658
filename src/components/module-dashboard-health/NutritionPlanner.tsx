import { Apple, ShoppingCart, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'
import type { MealTemplate, MacroTargets } from '@/types/module-dashboard-health'

interface NutritionPlannerProps {
  mealTemplates: MealTemplate[]
  macroTargets: MacroTargets
  isLoading?: boolean
}

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

export function NutritionPlanner({ mealTemplates, macroTargets, isLoading }: NutritionPlannerProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-56 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!mealTemplates.length) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-primary" />
            Nutrition Planner
          </CardTitle>
          <CardDescription>
            Meal templates, macro targets and grocery list generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Apple}
            heading="No meal templates"
            description="Add meal templates and set macro targets for better nutrition tracking."
            action={
              <Button className="transition-all duration-200 hover:scale-[1.02]" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add template
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
          <Apple className="h-5 w-5 text-primary" />
          Nutrition Planner
        </CardTitle>
        <CardDescription>
          Meal templates, macro targets and grocery list generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4 mb-6">
          <h4 className="font-medium text-sm mb-2">Macro targets</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Calories</span>
              <p className="font-semibold">{macroTargets.calories}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Protein</span>
              <p className="font-semibold">{macroTargets.protein}g</p>
            </div>
            <div>
              <span className="text-muted-foreground">Carbs</span>
              <p className="font-semibold">{macroTargets.carbs}g</p>
            </div>
            <div>
              <span className="text-muted-foreground">Fat</span>
              <p className="font-semibold">{macroTargets.fat}g</p>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Adherence</span>
              <span className="font-medium">{macroTargets.adherencePercent}%</span>
            </div>
            <Progress value={macroTargets.adherencePercent} className="h-2" />
          </div>
        </div>

        <div className="space-y-3">
          {mealTemplates.map((meal, idx) => (
            <div
              key={meal.id}
              className={cn(
                'animate-fade-in',
                'rounded-lg border p-4 transition-all duration-200',
                'bg-gradient-to-br from-card to-muted/20 border-border/80',
                'hover:shadow-md hover:scale-[1.01] hover:border-primary/30'
              )}
              style={{ animationDelay: `${idx * 75}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{meal.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {MEAL_LABELS[meal.mealType]} · {meal.calories} cal · P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1 transition-all duration-200 hover:scale-[1.01]" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add template
          </Button>
          <Button variant="outline" className="flex-1 transition-all duration-200 hover:scale-[1.01]" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Grocery list
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
