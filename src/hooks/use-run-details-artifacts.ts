import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchRunDetailsArtifacts,
  rollbackPreview,
  rollbackRun,
} from '@/api/run-details-artifacts'
export const RUN_DETAILS_ARTIFACTS_QUERY_KEY = (runId: string) => ['run-details-artifacts', runId] as const

export function useRunDetailsArtifacts(runId: string | undefined) {
  return useQuery({
    queryKey: RUN_DETAILS_ARTIFACTS_QUERY_KEY(runId ?? ''),
    queryFn: () => fetchRunDetailsArtifacts(runId!),
    enabled: !!runId,
    staleTime: 30 * 1000,
  })
}

export function useRollbackPreview(runId: string | undefined) {
  return useMutation({
    mutationFn: () => rollbackPreview(runId!),
  })
}

export function useRollbackRun(runId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => rollbackRun(runId!),
    onSuccess: () => {
      if (runId) queryClient.invalidateQueries({ queryKey: RUN_DETAILS_ARTIFACTS_QUERY_KEY(runId) })
    },
  })
}
