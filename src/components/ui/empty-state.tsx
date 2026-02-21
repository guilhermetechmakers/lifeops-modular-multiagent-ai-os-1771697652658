import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon: LucideIcon
  heading: string
  description: string
  action?: React.ReactNode
  className?: string
  iconClassName?: string
}

/**
 * Standardized empty state component per Design Reference:
 * Icon + heading + description + CTA. Used across LifeOps for consistent empty states.
 */
export function EmptyState({
  icon: Icon,
  heading,
  description,
  action,
  className,
  iconClassName,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center animate-fade-in',
        className
      )}
    >
      <Icon
        className={cn('h-12 w-12 text-muted-foreground mb-4 opacity-50', iconClassName)}
        aria-hidden
      />
      <h3 className="font-semibold text-lg">{heading}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      {action && <div className="flex flex-wrap justify-center gap-2 mt-4">{action}</div>}
    </div>
  )
}
