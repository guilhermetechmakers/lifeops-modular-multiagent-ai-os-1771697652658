import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, ArrowRight, Handshake, MessageSquare } from 'lucide-react'
import type { AgentMessage } from '@/types/run-details-artifacts'
import { cn } from '@/lib/utils'

interface MessageTraceViewerProps {
  messages?: AgentMessage[]
  isLoading?: boolean
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { timeStyle: 'short' })
}

export function MessageTraceViewer({ messages = [], isLoading }: MessageTraceViewerProps) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'handoff' | 'consensus'>('all')

  const filtered = useMemo(() => {
    let list = messages
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (m) =>
          m.fromAgent.toLowerCase().includes(q) ||
          m.toAgent.toLowerCase().includes(q) ||
          m.content.toLowerCase().includes(q)
      )
    }
    if (filterType !== 'all') {
      list = list.filter((m) => m.type === filterType)
    }
    return list
  }, [messages, search, filterType])

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (messages.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Message Trace</CardTitle>
          <CardDescription>Timeline of agent→agent messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-50" aria-hidden />
            <h3 className="font-semibold text-lg">No messages</h3>
            <p className="text-sm text-muted-foreground mt-1">No agent messages in this run.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Message Trace
          <Badge variant="secondary" className="font-normal">
            {messages.length} messages
          </Badge>
        </CardTitle>
        <CardDescription>
          Timeline of agent→agent messages with search and filter, highlighted handoffs/consensus
        </CardDescription>
        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              aria-label="Search messages"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'handoff', 'consensus'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200',
                  filterType === t
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                )}
              >
                {t === 'all' ? 'All' : t === 'handoff' ? 'Handoffs' : 'Consensus'}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filtered.map((msg, i) => (
            <div
              key={msg.id}
              className={cn(
                'rounded-xl border p-4 transition-all duration-300',
                msg.type === 'handoff' && 'border-primary/30 bg-primary/5',
                msg.type === 'consensus' && 'border-success/30 bg-success/5',
                msg.type === 'standard' && 'border-border bg-card',
                'hover:shadow-md'
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{msg.fromAgent}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{msg.toAgent}</span>
                {msg.type !== 'standard' && (
                  <Badge variant="outline" className="gap-1">
                    {msg.type === 'handoff' ? (
                      <Handshake className="h-3 w-3" />
                    ) : (
                      <MessageSquare className="h-3 w-3" />
                    )}
                    {msg.type}
                  </Badge>
                )}
                <span className="ml-auto text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{msg.content}</p>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No messages match your filters.</p>
        )}
      </CardContent>
    </Card>
  )
}
