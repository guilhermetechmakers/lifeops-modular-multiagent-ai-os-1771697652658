import { useState } from 'react'
import { FileEdit, MessageSquare, BookOpen, BarChart2, GitBranch } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { DraftVersion } from '@/types/module-dashboard-content'

interface EditorWorkspaceProps {
  drafts: DraftVersion[]
  isLoading?: boolean
}

const SEO_COLOR = (score?: number) => {
  if (!score) return 'text-muted-foreground'
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-primary'
  return 'text-destructive'
}

export function EditorWorkspace({ drafts, isLoading }: EditorWorkspaceProps) {
  const [activeDraftId, setActiveDraftId] = useState<string | undefined>(drafts[0]?.id)
  const activeDraft = drafts.find((d) => d.id === activeDraftId) ?? drafts[0]

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (!drafts.length) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-primary" />
            Editor Workspace
          </CardTitle>
          <CardDescription>Draft editor with agent suggestions, citations, SEO score and versioning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <FileEdit className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <h3 className="font-semibold text-lg">No drafts yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Create a draft from an idea to get agent suggestions, citations, and SEO feedback.
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
          <FileEdit className="h-5 w-5 text-primary" />
          Editor Workspace
        </CardTitle>
        <CardDescription>Draft editor with agent suggestions, citations, SEO score and versioning</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="citations">Citations</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="mt-4">
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <select
                    value={activeDraftId}
                    onChange={(e) => setActiveDraftId(e.target.value)}
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    {drafts.map((d) => (
                      <option key={d.id} value={d.id}>
                        Draft v{d.version} (Content {d.contentId})
                      </option>
                    ))}
                  </select>
                  {activeDraft && (
                    <div className="flex items-center gap-2">
                      <BarChart2 className={cn('h-4 w-4', SEO_COLOR(activeDraft.seoScore))} />
                      <span className={cn('text-sm font-medium', SEO_COLOR(activeDraft.seoScore))}>
                        SEO: {activeDraft.seoScore ?? '—'}
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className="rounded-lg border border-input bg-muted/20 p-4 min-h-[200px] prose prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: activeDraft?.content ?? '' }}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="suggestions" className="mt-4">
            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">Agent suggestions</span>
              </div>
              <p className="text-sm">Consider adding a stronger CTA in the closing paragraph.</p>
              <p className="text-sm">Expand the introduction with a hook that addresses reader pain points.</p>
            </div>
          </TabsContent>
          <TabsContent value="citations" className="mt-4">
            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">Citations</span>
              </div>
              <p className="text-sm text-muted-foreground">No citations added yet. Add sources to improve credibility.</p>
            </div>
          </TabsContent>
          <TabsContent value="versions" className="mt-4">
            <div className="space-y-2">
              {drafts.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setActiveDraftId(d.id)}
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-all duration-200',
                    activeDraftId === d.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">v{d.version}</span>
                    <Badge variant="outline" className="text-xs">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  {d.seoScore !== undefined && (
                    <span className={cn('text-sm', SEO_COLOR(d.seoScore))}>{d.seoScore}</span>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
