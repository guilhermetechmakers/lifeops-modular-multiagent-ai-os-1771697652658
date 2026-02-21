import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchSettingsPreferences,
  updateNotificationRules,
  updateAutomationDefaults,
  updateDataRetention,
  updateDeveloperSettings,
} from '@/api/settings-preferences'

export const SETTINGS_PREFERENCES_QUERY_KEY = ['settings-preferences'] as const

export function useSettingsPreferences() {
  return useQuery({
    queryKey: SETTINGS_PREFERENCES_QUERY_KEY,
    queryFn: fetchSettingsPreferences,
    staleTime: 60 * 1000,
  })
}

export function useUpdateNotificationRules() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateNotificationRules,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_PREFERENCES_QUERY_KEY })
      toast.success('Notification rules updated')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update notification rules')
    },
  })
}

export function useUpdateAutomationDefaults() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateAutomationDefaults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_PREFERENCES_QUERY_KEY })
      toast.success('Automation defaults updated')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update automation defaults')
    },
  })
}

export function useUpdateDataRetention() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateDataRetention,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_PREFERENCES_QUERY_KEY })
      toast.success('Data retention settings updated')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update data retention')
    },
  })
}

export function useUpdateDeveloperSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateDeveloperSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_PREFERENCES_QUERY_KEY })
      toast.success('Developer settings updated')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update developer settings')
    },
  })
}
