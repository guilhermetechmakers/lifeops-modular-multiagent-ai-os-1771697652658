import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchEmailVerificationStatus,
  verifyCode,
  resendVerificationEmail,
} from '@/api/email-verification'

export const EMAIL_VERIFICATION_QUERY_KEY = ['email-verification-status'] as const

export function useEmailVerificationStatus() {
  return useQuery({
    queryKey: EMAIL_VERIFICATION_QUERY_KEY,
    queryFn: fetchEmailVerificationStatus,
    staleTime: 30 * 1000,
  })
}

export function useVerifyCode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: verifyCode,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: EMAIL_VERIFICATION_QUERY_KEY })
        toast.success('Email verified successfully')
      } else {
        toast.error(data.error ?? 'Verification failed')
      }
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Verification failed')
    },
  })
}

export function useResendVerification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EMAIL_VERIFICATION_QUERY_KEY })
      if (data.success) {
        toast.success('Verification email sent')
      } else {
        toast.error(data.error ?? 'Failed to resend')
      }
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to resend')
    },
  })
}
