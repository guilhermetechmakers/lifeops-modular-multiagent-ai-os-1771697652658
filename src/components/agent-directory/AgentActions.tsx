import {
  MoreHorizontal,
  Power,
  PowerOff,
  Copy,
  Archive,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AgentDirectoryItem } from '@/types/agent-directory'

interface AgentActionsProps {
  agent: AgentDirectoryItem
  onEnable?: (id: string) => void
  onDisable?: (id: string) => void
  onClone?: (id: string) => void
  onArchive?: (id: string) => void
  onViewTrace?: (runId: string) => void
  isCloning?: boolean
  isArchiving?: boolean
}

export function AgentActions({
  agent,
  onEnable,
  onDisable,
  onClone,
  onArchive,
  onViewTrace,
  isCloning,
  isArchiving,
}: AgentActionsProps) {
  const isActive = agent.status === 'active'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => e.stopPropagation()}
          aria-label="Agent actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {isActive ? (
          <DropdownMenuItem onClick={() => onDisable?.(agent.id)}>
            <PowerOff className="h-4 w-4 mr-2" />
            Disable
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onEnable?.(agent.id)}>
            <Power className="h-4 w-4 mr-2" />
            Enable
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => onClone?.(agent.id)}
          disabled={isCloning}
        >
          <Copy className="h-4 w-4 mr-2" />
          Clone
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => agent.lastRunId && onViewTrace?.(agent.lastRunId)}
          disabled={!agent.lastRunId}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          View message trace
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onArchive?.(agent.id)}
          disabled={isArchiving}
          className="text-destructive focus:text-destructive"
        >
          <Archive className="h-4 w-4 mr-2" />
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
