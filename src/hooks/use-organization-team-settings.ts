import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchOrganizationTeamSettings,
  updateTeamRoster,
  updateRBACPolicies,
  updateBilling,
  updateEnterprise,
  createBillingPortalSession,
  createCheckoutSession,
} from '@/api/organization-team-settings'

export const ORGANIZATION_TEAM_SETTINGS_QUERY_KEY = ['organization-team-settings'] as const

export function useOrganizationTeamSettings() {
  return useQuery({
    queryKey: ORGANIZATION_TEAM_SETTINGS_QUERY_KEY,
    queryFn: fetchOrganizationTeamSettings,
    staleTime: 60 * 1000,
  })
}

export function useUpdateTeamRoster() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTeamRoster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_TEAM_SETTINGS_QUERY_KEY })
      toast.success('Team roster updated')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update team roster')
    },
  })
}

export function useUpdateRBACPolicies() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateRBACPolicies,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_TEAM_SETTINGS_QUERY_KEY })
      toast.success('RBAC policies updated')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update RBAC policies')
    },
  })
}

export function useUpdateBilling() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateBilling,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_TEAM_SETTINGS_QUERY_KEY })
      toast.success('Billing settings updated')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update billing')
    },
  })
}

export function useUpdateEnterprise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateEnterprise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATION_TEAM_SETTINGS_QUERY_KEY })
      toast.success('Enterprise settings updated')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update enterprise settings')
    },
  })
}

export function useCreateBillingPortalSession() {
  return useMutation({
    mutationFn: ({ returnUrl, customerId }: { returnUrl?: string; customerId?: string }) =>
      createBillingPortalSession(returnUrl, customerId),
    onSuccess: (data) => {
      if (data?.url) window.location.href = data.url
      else toast.error('Could not open billing portal')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to open billing portal')
    },
  })
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: ({
      priceId,
      successUrl,
      cancelUrl,
    }: {
      priceId?: string
      successUrl?: string
      cancelUrl?: string
    }) => createCheckoutSession(priceId, successUrl, cancelUrl),
    onSuccess: (data) => {
      if (data?.url) window.location.href = data.url
      else toast.error('Could not start checkout')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to start checkout')
    },
  })
}
