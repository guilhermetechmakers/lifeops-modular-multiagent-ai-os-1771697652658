import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAgentDirectory,
  fetchAgentDetails,
  createAgent,
  updateAgentStatus,
  cloneAgent,
  archiveAgent,
} from '@/api/agent-directory'
import type { AgentDirectoryFilters } from '@/api/agent-directory'
import type { CreateAgentPayload } from '@/types/agent-directory'

export const AGENT_DIRECTORY_QUERY_KEY = ['agent-directory'] as const
export const AGENT_DETAILS_QUERY_KEY = (id: string) =>
  ['agent-directory', 'details', id] as const

export function useAgentDirectory(filters?: AgentDirectoryFilters) {
  return useQuery({
    queryKey: [...AGENT_DIRECTORY_QUERY_KEY, filters],
    queryFn: () => fetchAgentDirectory(filters),
    staleTime: 30 * 1000,
  })
}

export function useAgentDetails(id: string | null) {
  return useQuery({
    queryKey: [...AGENT_DETAILS_QUERY_KEY(id ?? '')],
    queryFn: () => fetchAgentDetails(id!),
    enabled: !!id,
    staleTime: 30 * 1000,
  })
}

export function useCreateAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAgentPayload) => createAgent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENT_DIRECTORY_QUERY_KEY })
    },
  })
}

export function useUpdateAgentStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'idle' | 'archived' }) =>
      updateAgentStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: AGENT_DIRECTORY_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: AGENT_DETAILS_QUERY_KEY(id) })
    },
  })
}

export function useCloneAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cloneAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENT_DIRECTORY_QUERY_KEY })
    },
  })
}

export function useArchiveAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => archiveAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENT_DIRECTORY_QUERY_KEY })
    },
  })
}
