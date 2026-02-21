import { useState } from 'react'
import { Layers, Star, Search, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { useWorkflowTemplates } from '@/hooks/use-workflows'
import type { WorkflowModule } from '@/api/workflows'
import { cn } from '@/lib/utils'

const MODULE_OPTIONS: { value: WorkflowModule; label: string }[] = [
  { value: 'all', label: 'All modules' },
  { value: 'Content', label: 'Content' },
  { value: 'Projects', label: 'Projects' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Health', label: 'Health' },
]

function TemplatesGridSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20 mt-2" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full mt-4 rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function Workflows() {
  const [moduleFilter, setModuleFilter] = useState<WorkflowModule>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, isError, error, refetch } = useWorkflowTemplates(moduleFilter)

  const templates = data?.templates ?? []
  const filteredTemplates = searchQuery.trim()
    ? templates.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.domain.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : templates

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Workflow Templates</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Reusable multi-agent workflow templates by module
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-border shadow-card transition-all duration-300">
        <CardHeader className="space-y-4 sm:space-y-0 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-1 sm:max-w-2xl">
            <div className="relative flex-1 min-w-0">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                aria-hidden
              />
              <Input
                type="search"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Search workflow templates"
              />
            </div>
            <div className="flex flex-col gap-2 min-w-0 sm:w-40">
              <Label htmlFor="workflow-module-filter" className="text-sm font-medium">
                Filter by module
              </Label>
              <Select
                value={moduleFilter}
                onValueChange={(v) => setModuleFilter(v as WorkflowModule)}
              >
                <SelectTrigger
                  id="workflow-module-filter"
                  aria-label="Filter workflow templates by module"
                >
                  <SelectValue placeholder="All modules" />
                </SelectTrigger>
                <SelectContent>
                  {MODULE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <TemplatesGridSkeleton />
          ) : isError ? (
            <ErrorState
              heading="Failed to load templates"
              description={
                error instanceof Error ? error.message : 'Something went wrong. Please try again.'
              }
              onRetry={() => refetch()}
            />
          ) : filteredTemplates.length === 0 ? (
            <EmptyState
              icon={Layers}
              heading={templates.length === 0 ? 'No templates yet' : 'No matching templates'}
              description={
                templates.length === 0
                  ? 'Workflow templates will appear here when available. Create one to get started.'
                  : `No templates match "${searchQuery}". Try a different search or filter.`
              }
              action={
                <Button
                  className="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                  aria-label="Create workflow template"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create template
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((t, i) => (
                <Card
                  key={t.id}
                  className={cn(
                    'overflow-hidden animate-fade-in transition-all duration-300',
                    'hover:shadow-card-hover hover:border-primary/20 hover:-translate-y-0.5',
                    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
                  )}
                  style={{ animationDelay: `${i * 75}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <Layers className="h-5 w-5 text-primary" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base truncate">{t.name}</CardTitle>
                        <CardDescription className="truncate">{t.domain}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                      <Star
                        className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0"
                        aria-hidden
                      />
                      <span>{t.rating}</span>
                      <span className="text-muted-foreground">• {t.uses} uses</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full transition-all duration-200 hover:scale-[1.02]"
                    >
                      Import & Customize
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Workflows
