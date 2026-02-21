import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchUserProfile,
  updateProfileInfo,
  revokeConnection,
  createApiKey,
  revokeApiKey,
  updateAgentPresets,
  updateSecuritySettings,
} from '@/api/user-profile'

export const USER_PROFILE_QUERY_KEY = ['user-profile'] as const

export function useUserProfile() {
  return useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: fetchUserProfile,
    staleTime: 60 * 1000,
  })
}

export function useUpdateProfileInfo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProfileInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
      toast.success('Profile updated')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update profile')
    },
  })
}

export function useRevokeConnection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
      toast.success('Connection revoked')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to revoke connection')
    },
  })
}

export function useCreateApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ name, scope }: { name: string; scope?: string[] }) => createApiKey(name, scope),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
      const preview = (data as { _new_key_preview?: string })._new_key_preview
      toast.success(preview ? `API key created: ${preview}` : 'API key created')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create API key')
    },
  })
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
      toast.success('API key revoked')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to revoke API key')
    },
  })
}

export function useUpdateAgentPresets() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateAgentPresets,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
      toast.success('Agent presets updated')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update agent presets')
    },
  })
}

export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSecuritySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
      toast.success('Security settings updated')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update security settings')
    },
  })
}
