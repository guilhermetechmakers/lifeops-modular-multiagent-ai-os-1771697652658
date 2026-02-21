import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Download, ExternalLink, FileText, GitPullRequest, FileBarChart } from 'lucide-react'
import type { Artifact } from '@/types/run-details-artifacts'
import { cn } from '@/lib/utils'

interface ArtifactsPanelProps {
  artifacts?: Artifact[]
  isLoading?: boolean
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  file: FileText,
  pr: GitPullRequest,
  content: FileText,
  report: FileBarChart,
}

export function ArtifactsPanel({ artifacts = [], isLoading }: ArtifactsPanelProps) {
  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((_, idx) => (
              <Skeleton key={idx} className="h-24 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (artifacts.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Artifacts</CardTitle>
          <CardDescription>Downloadable files, PR links, content, reports</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={FileText}
            heading="No artifacts"
            description="No files, PRs, or reports generated in this run."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Artifacts
          <Badge variant="secondary" className="font-normal">
            {artifacts.length} items
          </Badge>
        </CardTitle>
        <CardDescription>
          Downloadable files, generated PR links, published content entries, exported reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artifacts.map((a) => {
            const Icon = typeIcons[a.type] ?? FileText
            return (
              <div
                key={a.id}
                className={cn(
                  'rounded-xl border border-border p-4 transition-all duration-300',
                  'hover:border-primary/30 hover:shadow-md hover:bg-muted/20'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{a.name}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {a.type}
                    </Badge>
                    <div className="mt-2 flex gap-2">
                      {a.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          asChild
                        >
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${a.name} in new tab`}
                          >
                            <ExternalLink className="h-4 w-4" aria-hidden />
                            Open
                          </a>
                        </Button>
                      )}
                      {a.downloadUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          asChild
                        >
                          <a
                            href={a.downloadUrl}
                            download
                            aria-label={`Download ${a.name}`}
                          >
                            <Download className="h-4 w-4" aria-hidden />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
