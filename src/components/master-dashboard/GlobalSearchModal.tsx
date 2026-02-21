import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bot,
  Play,
  FileText,
  ScrollText,
  Download,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useSearchEngine } from '@/hooks/use-search-engine'
import type { SearchResult, SearchResourceType } from '@/types/search-engine'
import { cn } from '@/lib/utils'

const TYPE_CONFIG: Record<
  SearchResourceType,
  { label: string; icon: typeof Bot; hrefPrefix: string }
> = {
  agent: { label: 'Agents', icon: Bot, hrefPrefix: '/dashboard/agent-directory' },
  run: { label: 'Runs', icon: Play, hrefPrefix: '/dashboard/runs' },
  artifact: { label: 'Artifacts', icon: FileText, hrefPrefix: '/dashboard/runs' },
  log: { label: 'Logs', icon: ScrollText, hrefPrefix: '/dashboard/runs' },
}

interface GlobalSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ResultItem({
  result,
  isSelected,
  onSelect,
}: {
  result: SearchResult
  isSelected: boolean
  onSelect: () => void
}) {
  const config = TYPE_CONFIG[result.type]
  const Icon = config.icon

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200',
        'hover:bg-muted/50 hover:border-primary/30 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isSelected && 'bg-primary/10 border-primary/40 ring-2 ring-primary/20'
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{result.title}</p>
        {result.description && (
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {result.description}
          </p>
        )}
        <Badge variant="secondary" className="mt-2 text-xs">
          {config.label}
        </Badge>
      </div>
    </button>
  )
}

export function GlobalSearchModal({ open, onOpenChange }: GlobalSearchModalProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<SearchResourceType[]>([
    'agent',
    'run',
    'artifact',
    'log',
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { mutate, data, isPending, isError, error } = useSearchEngine()

  const results = data?.results ?? []
  const facets = data?.facets ?? []

  const handleSearch = useCallback(() => {
    if (!query.trim()) return
    mutate({
      q: query.trim(),
      types: selectedTypes,
      limit: 20,
      facets: true,
    })
  }, [query, selectedTypes, mutate])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        mutate({
          q: query.trim(),
          types: selectedTypes,
          limit: 20,
          facets: true,
        })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, selectedTypes, mutate])

  useEffect(() => {
    if (open) {
      queueMicrotask(() => {
        setQuery('')
        setSelectedIndex(0)
      })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    queueMicrotask(() => setSelectedIndex(0))
  }, [results])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
      return
    }
    if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      const r = results[selectedIndex]
      navigate(r.href)
      onOpenChange(false)
    }
  }

  const handleExport = () => {
    if (!data?.results?.length) return
    const blob = new Blob(
      [JSON.stringify({ results: data.results, total: data.total }, null, 2)],
      { type: 'application/json' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lifeops-search-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleType = (type: SearchResourceType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0"
        showCloseButton
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="sr-only">Global search</DialogTitle>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              ref={inputRef}
              placeholder="Search agents, runs, artifacts, logs..."
              className="pl-9 h-11 bg-muted/30 border-border"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search query"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {(['agent', 'run', 'artifact', 'log'] as SearchResourceType[]).map(
              (type) => {
                const config = TYPE_CONFIG[type]
                const isActive = selectedTypes.includes(type)
                return (
                  <Button
                    key={type}
                    variant={isActive ? 'secondary' : 'outline'}
                    size="sm"
                    className="gap-1.5 transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => toggleType(type)}
                  >
                    <config.icon className="h-3.5 w-3.5" />
                    {config.label}
                    {facets.find((f) => f.type === type)?.count != null && (
                      <span className="text-muted-foreground text-xs">
                        ({facets.find((f) => f.type === type)?.count})
                      </span>
                    )}
                  </Button>
                )
              }
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col">
          {isError && (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="font-semibold text-lg">Search failed</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {error?.message ?? 'Something went wrong.'}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => handleSearch()}
              >
                Retry
              </Button>
            </div>
          )}

          {isPending && query.trim().length >= 2 && (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          {!isPending && !isError && query.trim().length < 2 && (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-semibold text-lg">Search across LifeOps</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Type at least 2 characters to search agents, runs, artifacts, and
                logs.
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Press <kbd className="px-1.5 py-0.5 rounded bg-muted">Esc</kbd> to
                close
              </p>
            </div>
          )}

          {!isPending && !isError && query.trim().length >= 2 && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-semibold text-lg">No results found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Try different keywords or adjust your filters.
              </p>
            </div>
          )}

          {!isPending && !isError && results.length > 0 && (
            <>
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-3">
                  {results.map((result, i) => (
                    <ResultItem
                      key={`${result.type}-${result.id}`}
                      result={result}
                      isSelected={i === selectedIndex}
                      onSelect={() => {
                        navigate(result.href)
                        onOpenChange(false)
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {data?.total ?? 0} result{data?.total !== 1 ? 's' : ''}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 transition-all duration-200 hover:scale-[1.02]"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" />
                  Export results
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
