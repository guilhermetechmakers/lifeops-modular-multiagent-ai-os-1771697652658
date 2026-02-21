import { useState } from 'react'
import {
  Search,
  Bot,
  LayoutGrid,
  List,
  Filter,
  Activity,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import type { AgentDirectoryItem } from '@/types/agent-directory'
import { cn } from '@/lib/utils'

export type ViewMode = 'card' | 'table'

interface AgentListProps {
  agents: AgentDirectoryItem[]
  isLoading?: boolean
  onSelectAgent?: (agent: AgentDirectoryItem) => void
  selectedId?: string | null
  filters?: {
    module?: string
    status?: string
    owner?: string
    tags?: string[]
  }
  onFiltersChange?: (filters: AgentListProps['filters']) => void
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
  renderActions?: (agent: AgentDirectoryItem) => React.ReactNode
}

const MODULES = ['Projects', 'Content', 'Finance', 'Health']
const STATUSES = ['active', 'idle', 'archived']
const OWNERS = ['System', 'User']

function HealthIndicator({ health }: { health?: AgentDirectoryItem['health'] }) {
  const config = {
    healthy: { color: 'bg-success', label: 'Healthy' },
    degraded: { color: 'bg-warning', label: 'Degraded' },
    unhealthy: { color: 'bg-destructive', label: 'Unhealthy' },
    unknown: { color: 'bg-muted', label: 'Unknown' },
  }
  const { color, label } = config[health ?? 'unknown']
  return (
    <span className="flex items-center gap-1.5" title={label}>
      <span className={cn('h-2 w-2 rounded-full', color)} aria-hidden />
      <span className="text-xs text-muted-foreground">{label}</span>
    </span>
  )
}

function AgentCard({
  agent,
  isSelected,
  onClick,
  renderActions,
}: {
  agent: AgentDirectoryItem
  isSelected: boolean
  onClick: () => void
  renderActions?: (agent: AgentDirectoryItem) => React.ReactNode
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02]',
        isSelected && 'ring-2 ring-primary'
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base truncate">{agent.title}</CardTitle>
              <p className="text-sm text-muted-foreground truncate">
                {agent.module ?? '—'}
              </p>
            </div>
          </div>
          {renderActions?.(agent)}
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {agent.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {agent.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1">
          {agent.connectors?.map((c) => (
            <Badge key={c} variant="secondary" className="text-xs">
              {c}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <HealthIndicator health={agent.health} />
          {agent.lastRun && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(agent.lastRun).toLocaleDateString()}
            </span>
          )}
        </div>
        <Badge
          variant={agent.status === 'active' ? 'success' : 'secondary'}
          className="mt-2"
        >
          {agent.status}
        </Badge>
      </CardContent>
    </Card>
  )
}

function AgentTableRow({
  agent,
  isSelected,
  onClick,
  renderActions,
}: {
  agent: AgentDirectoryItem
  isSelected: boolean
  onClick: () => void
  renderActions?: (agent: AgentDirectoryItem) => React.ReactNode
}) {
  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={cn(
        'border-b border-border transition-colors hover:bg-secondary/50 cursor-pointer',
        isSelected && 'bg-primary/5'
      )}
    >
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{agent.title}</p>
            <p className="text-sm text-muted-foreground">{agent.module ?? '—'}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <Badge variant={agent.status === 'active' ? 'success' : 'secondary'}>
          {agent.status}
        </Badge>
      </td>
      <td className="p-4">{agent.owner ?? '—'}</td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {agent.tags?.slice(0, 3).map((t) => (
            <Badge key={t} variant="outline" className="text-xs">
              {t}
            </Badge>
          ))}
        </div>
      </td>
      <td className="p-4">
        <HealthIndicator health={agent.health} />
      </td>
      <td className="p-4 text-sm text-muted-foreground">
        {agent.lastRun
          ? new Date(agent.lastRun).toLocaleString()
          : '—'}
      </td>
      <td className="p-4">{renderActions?.(agent)}</td>
    </tr>
  )
}

export function AgentList({
  agents,
  isLoading,
  onSelectAgent,
  selectedId,
  filters,
  onFiltersChange,
  viewMode = 'card',
  onViewModeChange,
  renderActions,
}: AgentListProps) {
  const [search, setSearch] = useState('')

  const filteredAgents = agents.filter(
    (a) =>
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase()) ||
      a.module?.toLowerCase().includes(search.toLowerCase()) ||
      a.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (agents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Bot className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg">No agents yet</h3>
          <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
            Create your first agent or import one from the Workflow Template
            Library to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Search agents"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={filters?.module ?? 'all'}
                onValueChange={(v) =>
                  onFiltersChange?.({ ...filters, module: v === 'all' ? undefined : v })
                }
              >
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All modules</SelectItem>
                  {MODULES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters?.status ?? 'all'}
                onValueChange={(v) =>
                  onFiltersChange?.({ ...filters, status: v === 'all' ? undefined : v })
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters?.owner ?? 'all'}
                onValueChange={(v) =>
                  onFiltersChange?.({ ...filters, owner: v === 'all' ? undefined : v })
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All owners</SelectItem>
                  {OWNERS.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex rounded-lg border border-input overflow-hidden">
                <Button
                  variant={viewMode === 'card' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => onViewModeChange?.('card')}
                  aria-label="Card view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => onViewModeChange?.('table')}
                  aria-label="Table view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'card' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent, i) => (
              <div
                key={agent.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <AgentCard
                  agent={agent}
                  isSelected={selectedId === agent.id}
                  onClick={() => onSelectAgent?.(agent)}
                  renderActions={renderActions}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium">Agent</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Owner</th>
                  <th className="text-left p-4 font-medium">Tags</th>
                  <th className="text-left p-4 font-medium">
                    <Activity className="h-4 w-4 inline mr-1" />
                    Health
                  </th>
                  <th className="text-left p-4 font-medium">Last run</th>
                  <th className="text-left p-4 font-medium w-16" />
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent) => (
                  <AgentTableRow
                    key={agent.id}
                    agent={agent}
                    isSelected={selectedId === agent.id}
                    onClick={() => onSelectAgent?.(agent)}
                    renderActions={renderActions}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
