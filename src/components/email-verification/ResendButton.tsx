import { useEffect, useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ResendButtonProps {
  onResend: () => void
  isPending: boolean
  canResendAt?: string | null
  className?: string
}

function getSecondsUntil(canResendAt: string): number {
  const now = new Date()
  const target = new Date(canResendAt)
  const diff = Math.ceil((target.getTime() - now.getTime()) / 1000)
  return Math.max(0, diff)
}

export function ResendButton({
  onResend,
  isPending,
  canResendAt,
  className,
}: ResendButtonProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(
    canResendAt ? getSecondsUntil(canResendAt) : 0
  )

  useEffect(() => {
    if (!canResendAt) {
      queueMicrotask(() => setSecondsLeft(0))
      return
    }
    const update = () => {
      const s = getSecondsUntil(canResendAt)
      setSecondsLeft(s)
    }
    queueMicrotask(update)
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [canResendAt])

  const isDisabled = isPending || (secondsLeft != null && secondsLeft > 0)

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <Button
        type="button"
        variant="outline"
        onClick={onResend}
        disabled={isDisabled}
        className="w-full sm:w-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        aria-label={secondsLeft && secondsLeft > 0 ? `Resend available in ${secondsLeft}s` : 'Resend verification email'}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending...
          </>
        ) : secondsLeft != null && secondsLeft > 0 ? (
          <>Resend in {secondsLeft}s</>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden />
            Resend verification email
          </>
        )}
      </Button>
      {secondsLeft != null && secondsLeft > 0 && (
        <p className="text-xs text-muted-foreground">
          Rate limited to prevent spam
        </p>
      )}
    </div>
  )
}
