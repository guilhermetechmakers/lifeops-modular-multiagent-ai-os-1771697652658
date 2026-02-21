import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface PasswordStrengthMeterProps {
  password: string
  className?: string
}

function getStrength(password: string): { score: number; label: string; barColor: string } {
  if (!password) return { score: 0, label: '', barColor: 'bg-muted' }
  let score = 0
  if (password.length >= 8) score += 25
  if (password.length >= 12) score += 15
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 20
  if (/[0-9]/.test(password)) score += 20
  if (/[^a-zA-Z0-9]/.test(password)) score += 20

  if (score < 40) return { score, label: 'Weak', barColor: 'bg-destructive' }
  if (score < 70) return { score, label: 'Fair', barColor: 'bg-warning' }
  if (score < 90) return { score, label: 'Good', barColor: 'bg-primary' }
  return { score, label: 'Strong', barColor: 'bg-success' }
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const { score, label, barColor } = useMemo(() => getStrength(password), [password])

  if (!password) return null

  return (
    <div className={cn('space-y-1', className)}>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full transition-all duration-300', barColor)}
          style={{ width: `${score}%` }}
        />
      </div>
      <p
        className={cn(
          'text-xs transition-colors duration-200',
          score < 40 && 'text-destructive',
          score >= 40 && score < 70 && 'text-warning',
          score >= 70 && 'text-success'
        )}
      >
        {label}
      </p>
    </div>
  )
}
