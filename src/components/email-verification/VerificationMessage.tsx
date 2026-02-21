import { useEffect, useState } from 'react'
import { Mail, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface VerificationMessageProps {
  expiresAt?: string | null
  email?: string | null
  className?: string
}

function formatTimeRemaining(expiresAt: string): string {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const diff = expiry.getTime() - now.getTime()
  if (diff <= 0) return 'Link expired'
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `${hours}h ${minutes}m remaining`
  if (minutes > 0) return `${minutes}m remaining`
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return `${seconds}s remaining`
}

export function VerificationMessage({
  expiresAt,
  email,
  className,
}: VerificationMessageProps) {
  const [countdown, setCountdown] = useState<string | null>(
    expiresAt ? formatTimeRemaining(expiresAt) : null
  )

  useEffect(() => {
    if (!expiresAt) return
    const update = () => setCountdown(formatTimeRemaining(expiresAt))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 animate-fade-in',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" aria-hidden />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Verify your email address
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We&apos;ve sent a verification link and 6-digit code to{' '}
            <strong className="text-foreground">{email ?? 'your email'}</strong>.
            Click the link in the email or enter the code below to complete
            verification.
          </p>
          {countdown && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" aria-hidden />
              <span>Link expires in: {countdown}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
