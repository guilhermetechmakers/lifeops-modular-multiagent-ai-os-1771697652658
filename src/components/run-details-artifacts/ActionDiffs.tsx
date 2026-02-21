import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { FileCode, FileText, BookOpen } from 'lucide-react'
import type { ActionDiff } from '@/types/run-details-artifacts'
import { cn } from '@/lib/utils'

interface ActionDiffsProps {
  diffs?: ActionDiff[]
  isLoading?: boolean
}

const resourceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  code: FileCode,
  docs: FileText,
  ledger: BookOpen,
}

function DiffLines({ content, type }: { content: string; type: 'before' | 'after' }) {
  const lines = content.split('\n')
  return (
    <pre className="overflow-auto rounded-lg bg-muted/50 p-4 text-xs font-mono leading-relaxed">
      {lines.map((line, i) => (
        <div
          key={i}
          className={cn(
            type === 'before' && line.startsWith('-') && 'bg-destructive/20 text-destructive',
            type === 'after' && line.startsWith('+') && 'bg-success/20 text-success'
          )}
        >
          {line || ' '}
        </div>
      ))}
    </pre>
  )
}

export function ActionDiffs({ diffs = [], isLoading }: ActionDiffsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(diffs[0]?.id ?? null)
  const selected = diffs.find((d) => d.id === selectedId) ?? diffs[0]

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (diffs.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Action Diffs</CardTitle>
          <CardDescription>Side-by-side diffs for modified resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <FileCode className="h-12 w-12 text-muted-foreground mb-4 opacity-50" aria-hidden />
            <h3 className="font-semibold text-lg">No diffs</h3>
            <p className="text-sm text-muted-foreground mt-1">
              No code, docs, or ledger changes in this run.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Action Diffs</CardTitle>
        <CardDescription>
          Side-by-side diffs for modified resources (code, docs, ledger entries)
        </CardDescription>
        <div className="flex flex-wrap gap-2 pt-2">
          {diffs.map((d) => {
            const Icon = resourceIcons[d.resourceType] ?? FileCode
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedId(d.id)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  selectedId === d.id
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                )}
              >
                <Icon className="h-4 w-4" />
                {d.resourcePath}
                <Badge variant="secondary" className="text-xs">
                  +{d.addedLines} -{d.removedLines}
                </Badge>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent>
        {selected && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Before</p>
              <div className="rounded-lg border border-border overflow-hidden">
                <DiffLines content={selected.beforeContent} type="before" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">After</p>
              <div className="rounded-lg border border-border overflow-hidden">
                <DiffLines content={selected.afterContent} type="after" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
