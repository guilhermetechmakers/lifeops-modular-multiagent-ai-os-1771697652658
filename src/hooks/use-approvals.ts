import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchApprovals,
  approveItem,
  rejectItem,
  type ApprovalItem,
} from '@/api/approvals'

export const APPROVALS_QUERY_KEY = ['approvals'] as const

export function useApprovals() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: APPROVALS_QUERY_KEY,
    queryFn: fetchApprovals,
    staleTime: 30 * 1000,
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveItem(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: APPROVALS_QUERY_KEY })
      const prev = queryClient.getQueryData<ApprovalItem[]>(APPROVALS_QUERY_KEY)
      queryClient.setQueryData<ApprovalItem[]>(
        APPROVALS_QUERY_KEY,
        (old) => old?.filter((a) => a.id !== id) ?? []
      )
      return { prev }
    },
    onSuccess: () => {
      toast.success('Approval granted')
    },
    onError: (err, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(APPROVALS_QUERY_KEY, context.prev)
      }
      toast.error(err instanceof Error ? err.message : 'Failed to approve')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: APPROVALS_QUERY_KEY })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectItem(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: APPROVALS_QUERY_KEY })
      const prev = queryClient.getQueryData<ApprovalItem[]>(APPROVALS_QUERY_KEY)
      queryClient.setQueryData<ApprovalItem[]>(
        APPROVALS_QUERY_KEY,
        (old) => old?.filter((a) => a.id !== id) ?? []
      )
      return { prev }
    },
    onSuccess: () => {
      toast.info('Approval rejected')
    },
    onError: (err, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(APPROVALS_QUERY_KEY, context.prev)
      }
      toast.error(err instanceof Error ? err.message : 'Failed to reject')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: APPROVALS_QUERY_KEY })
    },
  })

  return {
    ...query,
    approve: approveMutation.mutate,
    reject: rejectMutation.mutate,
    approvingId: approveMutation.isPending ? approveMutation.variables : undefined,
    rejectingId: rejectMutation.isPending ? rejectMutation.variables : undefined,
  }
}
