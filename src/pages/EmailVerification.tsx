import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { LifeOpsLogo } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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

function EmailVerificationSkeleton() {
  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader className="text-center">
        <Skeleton className="mx-auto h-12 w-12 rounded-full" />
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-32 mx-auto" />
      </CardContent>
    </Card>
  )
}

function EmailVerificationError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" aria-hidden />
        </div>
        <CardTitle>Something went wrong</CardTitle>
        <CardDescription>
          We couldn&apos;t load your verification status. Please try again.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry} className="w-full" variant="outline">
          Try again
        </Button>
      </CardContent>
    </Card>
  )
}

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
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <EmailVerificationSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <EmailVerificationError onRetry={() => refetch()} />
      </div>
    )
  }

  if (status?.verified) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <LifeOpsLogo size="lg" variant="gradient" asLink />
          </div>
          <CardTitle>Verify your email</CardTitle>
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
    </div>
  )
}
