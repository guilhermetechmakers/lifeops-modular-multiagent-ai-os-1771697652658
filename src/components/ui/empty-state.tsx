import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  /** Lucide icon (used when illustration is not provided) */
  icon: LucideIcon
  /** Optional custom illustration (takes precedence over icon when provided) */
  illustration?: React.ReactNode
  heading: string
  description: string
  action?: React.ReactNode
  className?: string
  iconClassName?: string
}

/**
 * Standardized empty state component per Design Reference:
 * Icon/illustration + heading + description + CTA. Used across LifeOps for consistent empty states.
 */
export function EmptyState({
  icon: Icon,
  illustration,
  heading,
  description,
  action,
  className,
  iconClassName,
}: EmptyStateProps) {
  const visual = illustration ?? <Icon className={cn('h-12 w-12 text-muted-foreground opacity-50', iconClassName)} aria-hidden />

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center animate-fade-in',
        className
      )}
    >
      <div className="mb-4 flex justify-center">
        {visual}
      </div>
      <h3 className="font-semibold text-lg">{heading}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      {action && <div className="flex flex-wrap justify-center gap-2 mt-4">{action}</div>}
    </div>
  )
}
