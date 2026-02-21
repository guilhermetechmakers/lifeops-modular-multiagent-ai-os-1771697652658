import {
  Bot,
  Target,
  Zap,
  Database,
  Plug,
  Shield,
  History,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import type { AgentDetails } from '@/types/agent-directory'
import { cn } from '@/lib/utils'

interface AgentDetailsPanelProps {
  agent: AgentDetails | null
  isLoading?: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewTrace?: (agentId: string) => void
  renderActions?: (agent: AgentDetails) => React.ReactNode
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4" />
        {title}
      </h4>
      <div className="rounded-lg border border-border bg-secondary/30 p-4">
        {children}
      </div>
    </div>
  )
}

export function AgentDetailsPanel({
  agent,
  isLoading,
  open,
  onOpenChange,
  onViewTrace,
  renderActions,
}: AgentDetailsPanelProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-xl truncate">
                  {agent?.title ?? 'Agent Details'}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {agent?.module ?? '—'} · {agent?.owner ?? '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {agent && renderActions?.(agent)}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-6">
          {isLoading ? (
            <div className="space-y-6 py-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : agent ? (
            <div className="space-y-6 py-4">
              {agent.purpose && (
                <Section title="Purpose" icon={Target}>
                  <p className="text-sm">{agent.purpose}</p>
                </Section>
              )}

              {agent.capabilities && agent.capabilities.length > 0 && (
                <Section title="Capabilities" icon={Zap}>
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map((c) => (
                      <Badge key={c} variant="secondary">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </Section>
              )}

              {agent.memoryScope && (
                <Section title="Memory Scope" icon={Database}>
                  <p className="text-sm">{agent.memoryScope}</p>
                </Section>
              )}

              {agent.connectors && agent.connectors.length > 0 && (
                <Section title="Connectors" icon={Plug}>
                  <div className="flex flex-wrap gap-2">
                    {agent.connectors.map((c) => (
                      <Badge key={c} variant="outline">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </Section>
              )}

              {agent.permissions && agent.permissions.length > 0 && (
                <Section title="Permissions" icon={Shield}>
                  <div className="flex flex-wrap gap-2">
                    {agent.permissions.map((p) => (
                      <Badge key={p} variant="outline">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </Section>
              )}

              {agent.runHistory && agent.runHistory.length > 0 && (
                <Section title="Run History" icon={History}>
                  <div className="space-y-2">
                    {agent.runHistory.map((run) => (
                      <div
                        key={run.id}
                        className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2 text-sm"
                      >
                        <span className="font-mono text-xs">{run.runId}</span>
                        <Badge
                          variant={
                            run.status === 'success'
                              ? 'success'
                              : run.status === 'failed'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {run.status}
                        </Badge>
                        <span className="text-muted-foreground">
                          {run.duration ? `${run.duration}s` : '—'}
                        </span>
                        {onViewTrace && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewTrace(run.runId)}
                          >
                            View trace
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Badge
                  variant={agent.status === 'active' ? 'success' : 'secondary'}
                >
                  {agent.status}
                </Badge>
                {agent.health && (
                  <span
                    className={cn(
                      'text-xs',
                      agent.health === 'healthy' && 'text-success',
                      agent.health === 'degraded' && 'text-warning',
                      agent.health === 'unhealthy' && 'text-destructive'
                    )}
                  >
                    {agent.health}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <Bot className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                Select an agent to view details
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
