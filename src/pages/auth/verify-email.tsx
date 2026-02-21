import { useState } from 'react'
import { Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function VerifyEmail() {
  const [code, setCode] = useState('')
  const [resending, setResending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    setError(null)
    if (code.length !== 6) {
      setError('Enter a 6-digit code')
      toast.error('Enter a 6-digit code')
      return
    }
    setIsVerifying(true)
    try {
      // TODO: API call for verification
      await new Promise((r) => setTimeout(r, 800))
      toast.success('Email verified')
      window.location.href = '/dashboard'
    } catch {
      setError('Verification failed. Please try again.')
      toast.error('Verification failed. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    setError(null)
    setResending(true)
    try {
      await new Promise((r) => setTimeout(r, 1000))
      toast.success('Verification email sent')
    } catch {
      setError('Failed to resend. Please try again.')
      toast.error('Failed to resend. Please try again.')
    } finally {
      setResending(false)
    }
  }

  const hasError = !!error

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      {/* Animated gradient mesh background - design tokens only */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div
          className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-float"
          style={{ animationDelay: '1.5s' }}
        />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-glow-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <Card
        className={cn(
          'w-full max-w-md shadow-card transition-all duration-300',
          hasError && 'animate-shake'
        )}
      >
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" aria-hidden />
          </div>
          <CardTitle className="text-card-foreground">Verify your email</CardTitle>
          <CardDescription className="text-muted-foreground">
            We sent a 6-digit code to your email. Enter it below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Verification code"
            placeholder="000000"
            maxLength={6}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, ''))
              setError(null)
            }}
            error={error ?? undefined}
            helperText="Enter the 6-digit code from your email"
            className="text-center text-2xl tracking-[0.5em]"
            disabled={isVerifying}
          />
          <Button
            onClick={handleVerify}
            className="w-full"
            disabled={isVerifying || resending || code.length !== 6}
            aria-busy={isVerifying}
            aria-label={isVerifying ? 'Verifying email' : 'Verify email'}
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email?{' '}
            <Button
              variant="link"
              className="p-0 h-auto text-primary hover:text-primary/90"
              onClick={handleResend}
              disabled={resending || isVerifying}
              aria-busy={resending}
              aria-label={resending ? 'Sending verification email' : 'Resend verification email'}
            >
              {resending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Sending...
                </>
              ) : (
                'Resend'
              )}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
