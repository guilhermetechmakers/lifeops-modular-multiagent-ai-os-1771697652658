import { useState, useMemo } from 'react'
import { Search, BookOpen, Code, Wrench, HelpCircle, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { useSearchDocs } from '@/hooks/use-docs-help'
import type { DocsSearchResult } from '@/types/docs-help'
import { cn } from '@/lib/utils'

const TYPE_ICONS: Record<DocsSearchResult['type'], React.ComponentType<{ className?: string }>> = {
  guide: BookOpen,
  api: Code,
  sdk: Wrench,
  troubleshooting: HelpCircle,
}

interface SearchableDocsProps {
  docs: DocsSearchResult[]
  isLoading?: boolean
}

export function SearchableDocs({ docs: initialDocs, isLoading }: SearchableDocsProps) {
  const [query, setQuery] = useState('')
  const { data, isLoading: isSearching, isError, refetch } = useSearchDocs(query)
  const results = useMemo(() => {
    if (query.length >= 2 && data?.results) return data.results
    return initialDocs
  }, [query, data, initialDocs])

  const showEmpty = !isLoading && !isSearching && !isError && results.length === 0
  const showResults = !isLoading && results.length > 0
  const showSearchError = query.length >= 2 && isError

  return (
    <Card className="overflow-hidden border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5 text-primary" aria-hidden />
          Searchable Docs
        </CardTitle>
        <CardDescription>
          Guides, API reference, agent development SDK, and troubleshooting
        </CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Search docs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-background/80 border-border focus-visible:ring-primary/50"
            aria-label="Search documentation"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : showSearchError ? (
          <div className="p-6">
            <ErrorState
              heading="Search failed"
              description="Unable to search documentation. Please try again."
              onRetry={() => refetch()}
            />
          </div>
        ) : showEmpty ? (
          <EmptyState
            icon={HelpCircle}
            heading="No results found"
            description="Try a different search term or browse the categories below."
          />
        ) : showResults ? (
          <div className="divide-y divide-border">
            {results.map((doc, idx) => {
              const Icon = TYPE_ICONS[doc.type]
              return (
                <a
                  key={doc.id}
                  href={doc.href}
                  aria-label={`${doc.title} - ${doc.category}`}
                  className={cn(
                    'flex items-start gap-4 px-6 py-4 transition-all duration-200',
                    'hover:bg-primary/5 hover:border-l-2 hover:border-l-primary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                  )}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{doc.title}</p>
                    {doc.description && (
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {doc.description}
                      </p>
                    )}
                    <span className="inline-block mt-2 text-xs text-primary font-medium">
                      {doc.category}
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
