import { Clock, GitBranch, Bot, Plug, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import type { Tutorial } from '@/types/docs-help'
import { cn } from '@/lib/utils'

const CATEGORY_CONFIG: Record<
  Tutorial['category'],
  { icon: React.ComponentType<{ className?: string }>; label: string; gradient: string }
> = {
  cronjob: { icon: Clock, label: 'Cronjob', gradient: 'from-primary/20 to-primary/5' },
  workflow: { icon: GitBranch, label: 'Workflow', gradient: 'from-accent/20 to-accent/5' },
  agent: { icon: Bot, label: 'Agent', gradient: 'from-success/20 to-success/5' },
  integration: { icon: Plug, label: 'Integration', gradient: 'from-warning/20 to-warning/5' },
}

interface TutorialsTemplatesProps {
  tutorials: Tutorial[]
  isLoading?: boolean
}

export function TutorialsTemplates({ tutorials, isLoading }: TutorialsTemplatesProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!tutorials.length) {
    return (
      <Card className="overflow-hidden border-border/50">
        <CardHeader>
          <CardTitle>Tutorials & Templates</CardTitle>
          <CardDescription>Quickstarts for common Cronjobs and workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tutorials yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Tutorials and templates will appear here. Check back soon.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-accent/5 to-primary/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Clock className="h-5 w-5 text-accent" />
          Tutorials & Templates
        </CardTitle>
        <CardDescription>
          Quickstarts for common Cronjobs and workflows
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {tutorials.map((tutorial) => {
            const config = CATEGORY_CONFIG[tutorial.category]
            const Icon = config.icon
            return (
              <a
                key={tutorial.id}
                href={tutorial.href}
                className={cn(
                  'group relative flex flex-col rounded-xl border border-border/50 p-5',
                  'bg-gradient-to-br transition-all duration-300',
                  'hover:border-primary/30 hover:shadow-lg hover:scale-[1.02]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  config.gradient
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="rounded-lg bg-background/50 p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {tutorial.duration ?? 'Quick'}
                  </Badge>
                </div>
                <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tutorial.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2 flex-1">
                  {tutorial.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Start tutorial
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
