import { Lightbulb, Sparkles, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ContentIdea } from '@/types/module-dashboard-content'

interface IdeaInboxProps {
  ideas: ContentIdea[]
  isLoading?: boolean
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  outlined: 'Outlined',
  drafting: 'Drafting',
  scheduled: 'Scheduled',
  published: 'Published',
}

const PRIORITY_COLOR = (score: number) => {
  if (score >= 90) return 'bg-success/20 text-success border-success/30'
  if (score >= 75) return 'bg-primary/20 text-primary border-primary/30'
  return 'bg-muted text-muted-foreground border-border'
}

export function IdeaInbox({ ideas, isLoading }: IdeaInboxProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!ideas.length) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Idea Inbox
          </CardTitle>
          <CardDescription>Collected ideas with agent-generated outlines and priority scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <h3 className="font-semibold text-lg">No ideas yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Add content ideas or let agents suggest outlines with priority scores.
            </p>
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
          <Lightbulb className="h-5 w-5 text-primary" />
          Idea Inbox
        </CardTitle>
        <CardDescription>Collected ideas with agent-generated outlines and priority scores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ideas.map((idea, i) => (
            <div
              key={idea.id}
              className={cn(
                'rounded-lg border p-4 transition-all duration-200',
                'bg-gradient-to-br from-card to-muted/20 border-border/80',
                'hover:shadow-md hover:scale-[1.01] hover:border-primary/30',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium truncate">{idea.title}</h4>
                    {idea.agentSuggested && (
                      <Badge variant="outline" className="text-xs border-accent/30 bg-accent/10 text-accent">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Agent
                      </Badge>
                    )}
                    <Badge variant="outline" className={cn('text-xs', PRIORITY_COLOR(idea.priorityScore))}>
                      {idea.priorityScore}
                    </Badge>
                  </div>
                  {idea.outline && (
                    <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap font-sans">
                      {idea.outline}
                    </pre>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {STATUS_LABELS[idea.status] ?? idea.status}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
