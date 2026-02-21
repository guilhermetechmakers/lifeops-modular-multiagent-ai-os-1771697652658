import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/auth-layout'
import { LifeOpsLogo } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import {
  VerificationMessage,
  ResendButton,
  ManualCodeInput,
  SupportLink,
} from '@/components/email-verification'
import {
  useEmailVerificationStatus,
  useVerifyCode,
  useResendVerification,
} from '@/hooks/use-email-verification'

export default function EmailVerification() {
  const navigate = useNavigate()
  const {
    data: status,
    isLoading,
    isError,
    refetch,
  } = useEmailVerificationStatus()
  const verifyMutation = useVerifyCode()
  const resendMutation = useResendVerification()

  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Verify Email | LifeOps'
    return () => { document.title = prevTitle }
  }, [])

  useEffect(() => {
    if (status?.verified) {
      navigate('/dashboard', { replace: true })
    }
  }, [status?.verified, navigate])

  const handleVerify = (code: string) => {
    verifyMutation.mutate(code, {
      onSuccess: (data) => {
        if (data.success) {
          navigate('/dashboard', { replace: true })
        }
      },
    })
  }

  if (isLoading) {
    return (
      <AuthLayout pageTitle="Verify your email" isLoading>
        <div />
      </AuthLayout>
    )
  }

  if (isError) {
    return (
      <AuthLayout
        pageTitle="Verify your email"
        error={{
          heading: 'Something went wrong',
          description: "We couldn't load your verification status. Please try again.",
          onRetry: () => refetch(),
        }}
      >
        <div />
      </AuthLayout>
    )
  }

  if (status?.verified) {
    return null
  }

  return (
    <AuthLayout pageTitle="Verify your email">
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <LifeOpsLogo size="lg" variant="gradient" asLink />
          </div>
          <h2 className="text-xl font-semibold leading-none tracking-tight">Verify your email</h2>
          <CardDescription>
            Complete your account setup by verifying your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <VerificationMessage
            expiresAt={status?.expires_at}
            email={status?.email}
          />
          <ManualCodeInput
            onVerify={handleVerify}
            isPending={verifyMutation.isPending}
            error={verifyMutation.data?.success === false ? verifyMutation.data.error : undefined}
          />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Didn&apos;t receive the email?
              </span>
            </div>
          </div>
          <ResendButton
            onResend={() => resendMutation.mutate()}
            isPending={resendMutation.isPending}
            canResendAt={status?.can_resend_at}
          />
          <SupportLink />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
