import { useState, useCallback } from 'react'
import { Plus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AgentList } from '@/components/agent-directory/AgentList'
import { AgentDetailsPanel } from '@/components/agent-directory/AgentDetailsPanel'
import { CreateAgentWizard } from '@/components/agent-directory/CreateAgentWizard'
import { AgentActions } from '@/components/agent-directory/AgentActions'
import {
  useAgentDirectory,
  useAgentDetails,
  useCreateAgent,
  useUpdateAgentStatus,
  useCloneAgent,
  useArchiveAgent,
} from '@/hooks/use-agent-directory'
import type { AgentDirectoryFilters } from '@/api/agent-directory'
import type { ViewMode } from '@/components/agent-directory/AgentList'
import { toast } from 'sonner'

export default function AgentDirectory() {
  const [filters, setFilters] = useState<AgentDirectoryFilters>({})
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)

  const { data: agents = [], isLoading, isError, refetch } = useAgentDirectory(filters)
  const { data: agentDetails, isLoading: detailsLoading } = useAgentDetails(
    detailsOpen ? selectedId : null
  )
  const createMutation = useCreateAgent()
  const updateStatusMutation = useUpdateAgentStatus()
  const cloneMutation = useCloneAgent()
  const archiveMutation = useArchiveAgent()

  const handleSelectAgent = useCallback((agent: { id: string }) => {
    setSelectedId(agent.id)
    setDetailsOpen(true)
  }, [])

  const handleEnable = useCallback(
    (id: string) => {
      updateStatusMutation.mutate(
        { id, status: 'active' },
        {
          onSuccess: () => toast.success('Agent enabled'),
          onError: () => toast.error('Failed to enable agent'),
        }
      )
    },
    [updateStatusMutation]
  )

  const handleDisable = useCallback(
    (id: string) => {
      updateStatusMutation.mutate(
        { id, status: 'idle' },
        {
          onSuccess: () => toast.success('Agent disabled'),
          onError: () => toast.error('Failed to disable agent'),
        }
      )
    },
    [updateStatusMutation]
  )

  const handleClone = useCallback(
    (id: string) => {
      cloneMutation.mutate(id, {
        onSuccess: () => toast.success('Agent cloned'),
        onError: () => toast.error('Failed to clone agent'),
      })
    },
    [cloneMutation]
  )

  const handleArchive = useCallback(
    (id: string) => {
      archiveMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Agent archived')
          if (selectedId === id) {
            setDetailsOpen(false)
            setSelectedId(null)
          }
        },
        onError: () => toast.error('Failed to archive agent'),
      })
    },
    [archiveMutation, selectedId]
  )

  const handleViewTrace = useCallback((runId: string) => {
    window.location.href = `/dashboard/runs/${runId}`
  }, [])

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Agent Directory</h1>
          <p className="text-muted-foreground mt-1">
            List and manage all agents (system and user created)
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-destructive/30 bg-destructive/5">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="font-semibold text-lg">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Failed to load agent directory.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agent Directory</h1>
          <p className="text-muted-foreground mt-1">
            List and manage all agents (system and user created). Create, edit,
            view agent details, capabilities and logs.
          </p>
        </div>
        <Button onClick={() => setWizardOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
      </div>

      <AgentList
        agents={agents}
        isLoading={isLoading}
        onSelectAgent={handleSelectAgent}
        selectedId={selectedId}
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        renderActions={(agent) => (
          <AgentActions
            agent={agent}
            onEnable={handleEnable}
            onDisable={handleDisable}
            onClone={handleClone}
            onArchive={handleArchive}
            onViewTrace={handleViewTrace}
            isCloning={cloneMutation.isPending}
            isArchiving={archiveMutation.isPending}
          />
        )}
      />

      <AgentDetailsPanel
        agent={agentDetails ?? null}
        isLoading={detailsLoading}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onViewTrace={handleViewTrace}
        renderActions={
          agentDetails
            ? (agent) => (
                <AgentActions
                  agent={agent}
                  onEnable={handleEnable}
                  onDisable={handleDisable}
                  onClone={handleClone}
                  onArchive={handleArchive}
                  onViewTrace={handleViewTrace}
                  isCloning={cloneMutation.isPending}
                  isArchiving={archiveMutation.isPending}
                />
              )
            : undefined
        }
      />

      <CreateAgentWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onCreateSuccess={() => refetch()}
        createAgent={async (payload) => {
          await createMutation.mutateAsync(payload)
        }}
      />
    </div>
  )
}
