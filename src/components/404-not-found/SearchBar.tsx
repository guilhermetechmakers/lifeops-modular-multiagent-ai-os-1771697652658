import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSearchEngine } from '@/hooks/use-search-engine'
import type { SearchResult } from '@/types/search-engine'
import { cn } from '@/lib/utils'

export interface SearchBarProps {
  className?: string
  onResultSelect?: () => void
}

const TYPE_LABELS: Record<string, string> = {
  agent: 'Agent',
  run: 'Run',
  artifact: 'Artifact',
  log: 'Log',
}

export function SearchBar({ className, onResultSelect }: SearchBarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { mutate, data, isPending } = useSearchEngine()

  const results = data?.results ?? []
  const hasResults = results.length > 0
  const showResults = query.trim().length >= 2 && (isPending || hasResults)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        mutate({
          q: query.trim(),
          types: ['agent', 'run', 'artifact', 'log'],
          limit: 8,
          facets: false,
        })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, mutate])

  const handleResultClick = (result: SearchResult) => {
    navigate(result.href)
    onResultSelect?.()
  }

  return (
    <div className={cn('relative w-full max-w-xl', className)}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Search content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 h-11 bg-card/80 border-border focus-visible:ring-primary/50 transition-all duration-200"
          aria-label="Quick search to find content"
          aria-describedby="search-hint"
        />
        <span id="search-hint" className="sr-only">
          Type at least 2 characters to search
        </span>
      </div>

      {showResults && (
        <div
          className={cn(
            'absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-card shadow-card-hover overflow-hidden z-50',
            'animate-fade-in'
          )}
        >
          {isPending ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
              <div className="flex justify-center py-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          ) : hasResults ? (
            <div className="max-h-64 overflow-y-auto py-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  type="button"
                  onClick={() => handleResultClick(result)}
                  className={cn(
                    'w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-200',
                    'hover:bg-primary/10 hover:border-l-2 hover:border-l-primary border-l-2 border-l-transparent',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{result.title}</p>
                    {result.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {result.description}
                      </p>
                    )}
                    <span className="inline-block mt-1 text-xs text-primary font-medium">
                      {TYPE_LABELS[result.type] ?? result.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                No results found. Try different keywords.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigate('/docs')}
              >
                Browse docs
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
