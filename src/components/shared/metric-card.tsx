import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { cn } from '@/lib/utils'

/** Icon size tokens - use consistently across all metric card icons */
const ICON_SIZES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const

export interface MetricCardProps {
  /** Card title */
  title: string
  /** Primary value to display */
  value: React.ReactNode
  /** Lucide icon for the metric */
  icon: LucideIcon
  /** Optional description below the value */
  description?: string
  /** Optional trend: positive (green), negative (red), or neutral */
  trend?: 'up' | 'down' | 'neutral'
  /** Optional trend value (e.g. "+12%", "-5%") */
  trendValue?: string
  /** Gradient accent: primary, accent, success, warning, or muted */
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'muted'
  /** Loading state - shows skeleton */
  isLoading?: boolean
  /** Error state - shows error UI with optional retry */
  isError?: boolean
  /** Error message override */
  errorMessage?: string
  /** Retry callback when in error state */
  onRetry?: () => void
  /** Empty state - shows empty UI when value is empty/null */
  isEmpty?: boolean
  /** Empty state heading */
  emptyHeading?: string
  /** Empty state description */
  emptyDescription?: string
  /** Icon size: sm (h-4 w-4), md (h-5 w-5), lg (h-6 w-6) */
  iconSize?: keyof typeof ICON_SIZES
  /** Optional click handler for interactive cards */
  onClick?: () => void
  /** Additional class names */
  className?: string
}

const VARIANT_GRADIENTS: Record<NonNullable<MetricCardProps['variant']>, string> = {
  primary: 'from-primary/20 to-primary/5',
  accent: 'from-accent/20 to-accent/5',
  success: 'from-success/20 to-success/5',
  warning: 'from-warning/20 to-warning/5',
  muted: 'from-muted/30 to-muted/10',
}

function MetricCardSkeleton({ iconSize = 'md' }: { iconSize?: keyof typeof ICON_SIZES }) {
  const sizeClass = ICON_SIZES[iconSize]
  return (
    <Card className="border-border/50 overflow-hidden" aria-busy="true" aria-label="Loading metric">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className={cn('rounded', sizeClass)} />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-12" />
      </CardContent>
    </Card>
  )
}

/**
 * MetricCard - Reusable metric display card per Design Reference.
 * Uses design system tokens (no hardcoded hex), consistent Lucide icon sizing,
 * loading/empty/error states, and responsive mobile-first layout.
 */
export function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  variant = 'primary',
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  isEmpty = false,
  emptyHeading = 'No data',
  emptyDescription = 'Data for this metric is not available.',
  iconSize = 'md',
  onClick,
  className,
}: MetricCardProps) {
  const sizeClass = ICON_SIZES[iconSize]
  const gradient = VARIANT_GRADIENTS[variant]

  if (isLoading) {
    return <MetricCardSkeleton iconSize={iconSize} />
  }

  if (isError) {
    return (
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={cn(sizeClass, 'text-muted-foreground')} aria-hidden />
        </CardHeader>
        <CardContent>
          <ErrorState
            heading={errorMessage ?? 'Failed to load'}
            description="Unable to load this metric. Please try again."
            onRetry={onRetry}
            className="py-8"
          />
        </CardContent>
      </Card>
    )
  }

  if (isEmpty) {
    return (
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={cn(sizeClass, 'text-muted-foreground')} aria-hidden />
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Icon}
            heading={emptyHeading}
            description={emptyDescription}
            iconClassName="h-8 w-8"
            className="py-8"
          />
        </CardContent>
      </Card>
    )
  }

  const isInteractive = typeof onClick === 'function'

  return (
    <Card
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      className={cn(
        'relative overflow-hidden border-border/50 transition-all duration-300',
        'hover:shadow-card-hover hover:border-primary/20',
        isInteractive && 'cursor-pointer hover:scale-[1.02] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'animate-fade-in',
        className
      )}
    >
      <div
        className={cn('absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none', gradient)}
        aria-hidden
      />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn(sizeClass, 'text-muted-foreground shrink-0')} aria-hidden />
      </CardHeader>
      <CardContent className="relative">
        <div className="flex flex-col gap-1 sm:gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {trend !== undefined && trendValue && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-medium',
                  trend === 'up' && 'text-success',
                  trend === 'down' && 'text-destructive',
                  trend === 'neutral' && 'text-muted-foreground'
                )}
              >
                {trend === 'up' && <TrendingUp className="h-4 w-4 shrink-0" aria-hidden />}
                {trend === 'down' && <TrendingDown className="h-4 w-4 shrink-0" aria-hidden />}
                {trendValue}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
