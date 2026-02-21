import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  cicdTriggerPipeline,
  cicdGetRunStatus,
  cicdFetchArtifacts,
  cicdRetryRun,
  cicdListCredentials,
  cicdSaveCredentials,
  cicdDeleteCredentials,
} from '@/api/cicd-provider'
import type {
  CicdProvider,
  CicdTriggerPayload,
  CicdRetryPayload,
  CicdCredentialsPayload,
} from '@/types/cicd-provider'

export const CICD_CREDENTIALS_QUERY_KEY = ['cicd-credentials'] as const

export function useCicdCredentials(provider?: CicdProvider) {
  return useQuery({
    queryKey: [...CICD_CREDENTIALS_QUERY_KEY, provider],
    queryFn: () => cicdListCredentials(provider),
    staleTime: 60 * 1000,
  })
}

export function useCicdTriggerPipeline() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CicdTriggerPayload) => cicdTriggerPipeline(payload),
    onSuccess: () => {
      toast.success('Pipeline triggered successfully')
      queryClient.invalidateQueries({ queryKey: CICD_CREDENTIALS_QUERY_KEY })
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to trigger pipeline')
    },
  })
}

export function useCicdRunStatus(provider: CicdProvider, runId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['cicd-status', provider, runId],
    queryFn: () => cicdGetRunStatus({ provider, runId: runId! }),
    enabled: !!runId && enabled,
    staleTime: 10 * 1000,
  })
}

export function useCicdArtifacts(provider: CicdProvider, runId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['cicd-artifacts', provider, runId],
    queryFn: () => cicdFetchArtifacts({ provider, runId: runId! }),
    enabled: !!runId && enabled,
  })
}

export function useCicdRetryRun() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CicdRetryPayload) => cicdRetryRun(payload),
    onSuccess: () => {
      toast.success('Retry requested successfully')
      queryClient.invalidateQueries({ queryKey: ['cicd-status'] })
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to retry run')
    },
  })
}

export function useCicdSaveCredentials() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CicdCredentialsPayload) => cicdSaveCredentials(payload),
    onSuccess: () => {
      toast.success('Credentials saved')
      queryClient.invalidateQueries({ queryKey: CICD_CREDENTIALS_QUERY_KEY })
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to save credentials')
    },
  })
}

export function useCicdDeleteCredentials() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { provider: CicdProvider }) => cicdDeleteCredentials(payload),
    onSuccess: () => {
      toast.success('Credentials removed')
      queryClient.invalidateQueries({ queryKey: CICD_CREDENTIALS_QUERY_KEY })
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to delete credentials')
    },
  })
}
