import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchDocsHelp,
  searchDocs,
  submitSupportTicket,
} from '@/api/docs-help'
import type { SupportTicketRequest } from '@/types/docs-help'

export const DOCS_HELP_QUERY_KEY = ['docs-help'] as const

export function useDocsHelp() {
  return useQuery({
    queryKey: DOCS_HELP_QUERY_KEY,
    queryFn: fetchDocsHelp,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSearchDocs(q: string) {
  return useQuery({
    queryKey: [...DOCS_HELP_QUERY_KEY, 'search', q],
    queryFn: () => searchDocs(q),
    enabled: q.length >= 2,
    staleTime: 60 * 1000,
  })
}

export function useSubmitSupportTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ticket: SupportTicketRequest) => submitSupportTicket(ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCS_HELP_QUERY_KEY })
      toast.success('Support ticket submitted successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to submit support ticket')
    },
  })
}
