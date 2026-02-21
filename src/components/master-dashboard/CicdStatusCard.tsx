import { Link } from 'react-router-dom'
import { GitBranch, ChevronRight, Plug, Circle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCicdCredentials } from '@/hooks/use-cicd-provider'
import { cn } from '@/lib/utils'

const providerLabels: Record<string, string> = {
  circleci: 'CircleCI',
  jenkins: 'Jenkins',
  github_actions: 'GitHub Actions',
}

export function CicdStatusCard() {
  const { data, isLoading, isError } = useCicdCredentials()
  const credentials = data?.credentials ?? []
  const configuredCount = credentials.length

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return null
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-border/50 transition-all duration-300',
        'hover:shadow-card-hover hover:scale-[1.02] hover:-translate-y-0.5 hover:border-primary/30',
        'animate-fade-in'
      )}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-50 pointer-events-none"
        aria-hidden
      />
      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <GitBranch className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-sm font-medium">CI/CD Pipelines</CardTitle>
            <CardDescription>
              {configuredCount > 0
                ? `${configuredCount} provider${configuredCount > 1 ? 's' : ''} configured`
                : 'Connect CircleCI, Jenkins, or GitHub Actions'}
            </CardDescription>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="relative">
        {configuredCount > 0 ? (
          <div className="flex flex-wrap gap-2">
            {credentials.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              >
                <Circle className="h-1.5 w-1.5 fill-current" />
                {providerLabels[c.provider] ?? c.provider}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Trigger pipelines from Cronjobs and surface CI statuses on dashboards.
          </p>
        )}
        <Button variant="outline" size="sm" className="mt-4 w-full gap-2" asChild>
          <Link to="/dashboard/connectors">
            <Plug className="h-4 w-4" />
            {configuredCount > 0 ? 'Manage CI/CD credentials' : 'Configure CI/CD'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
