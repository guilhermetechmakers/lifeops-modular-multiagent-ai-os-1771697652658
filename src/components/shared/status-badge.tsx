import type { LucideIcon } from 'lucide-react'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Loader2,
  HelpCircle,
  Pause,
  Play,
  CircleDot,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/** Status types commonly used across LifeOps dashboards */
export type StatusBadgeStatus =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'pending_approval'
  | 'connected'
  | 'disconnected'
  | 'operational'
  | 'degraded'
  | 'outage'
  | 'paid'
  | 'suspended'
  | 'todo'
  | 'in_progress'
  | 'done'
  | (string & Record<never, never>)

export type StatusBadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'

interface StatusConfig {
  icon: LucideIcon
  variant: StatusBadgeVariant
  label: string
  iconClassName?: string
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  active: {
    icon: CheckCircle,
    variant: 'success',
    label: 'Active',
    iconClassName: 'text-success',
  },
  inactive: {
    icon: XCircle,
    variant: 'secondary',
    label: 'Inactive',
    iconClassName: 'text-muted-foreground',
  },
  pending: {
    icon: Clock,
    variant: 'secondary',
    label: 'Pending',
    iconClassName: 'text-muted-foreground',
  },
  running: {
    icon: Play,
    variant: 'secondary',
    label: 'Running',
    iconClassName: 'text-primary',
  },
  completed: {
    icon: CheckCircle,
    variant: 'success',
    label: 'Completed',
    iconClassName: 'text-success',
  },
  failed: {
    icon: XCircle,
    variant: 'destructive',
    label: 'Failed',
    iconClassName: 'text-destructive',
  },
  pending_approval: {
    icon: Pause,
    variant: 'warning',
    label: 'Pending Approval',
    iconClassName: 'text-warning',
  },
  connected: {
    icon: CheckCircle,
    variant: 'success',
    label: 'Connected',
    iconClassName: 'text-success',
  },
  disconnected: {
    icon: XCircle,
    variant: 'secondary',
    label: 'Disconnected',
    iconClassName: 'text-muted-foreground',
  },
  operational: {
    icon: CheckCircle,
    variant: 'success',
    label: 'Operational',
    iconClassName: 'text-success',
  },
  degraded: {
    icon: AlertTriangle,
    variant: 'warning',
    label: 'Degraded',
    iconClassName: 'text-warning',
  },
  outage: {
    icon: XCircle,
    variant: 'destructive',
    label: 'Outage',
    iconClassName: 'text-destructive',
  },
  paid: {
    icon: CheckCircle,
    variant: 'success',
    label: 'Paid',
    iconClassName: 'text-success',
  },
  suspended: {
    icon: Pause,
    variant: 'secondary',
    label: 'Suspended',
    iconClassName: 'text-muted-foreground',
  },
  todo: {
    icon: CircleDot,
    variant: 'outline',
    label: 'To Do',
    iconClassName: 'text-muted-foreground',
  },
  in_progress: {
    icon: Loader2,
    variant: 'secondary',
    label: 'In Progress',
    iconClassName: 'text-primary',
  },
  done: {
    icon: CheckCircle,
    variant: 'success',
    label: 'Done',
    iconClassName: 'text-success',
  },
}

const DEFAULT_CONFIG: StatusConfig = {
  icon: HelpCircle,
  variant: 'outline',
  label: 'Unknown',
  iconClassName: 'text-muted-foreground',
}

export interface StatusBadgeProps {
  /** Status value (normalized to lowercase with underscores) */
  status: StatusBadgeStatus | null | undefined
  /** Custom label override (defaults to config label) */
  label?: string
  /** Show loading skeleton */
  isLoading?: boolean
  /** Show error state styling */
  isError?: boolean
  /** Show icon (default: true) */
  showIcon?: boolean
  /** Size: sm (compact), md (default), lg */
  size?: 'sm' | 'md' | 'lg'
  /** Additional class names */
  className?: string
}

/**
 * StatusBadge displays status with Lucide icon and shadcn Badge.
 * Uses consistent Tailwind spacing (gap-2, px-2.5 py-0.5) and design system tokens.
 */
export function StatusBadge({
  status,
  label: labelOverride,
  isLoading = false,
  isError = false,
  showIcon = true,
  size = 'md',
  className,
}: StatusBadgeProps) {
  if (isLoading) {
    return (
      <Skeleton
        className={cn(
          'rounded-full',
          size === 'sm' && 'h-5 w-16',
          size === 'md' && 'h-6 w-20',
          size === 'lg' && 'h-7 w-24',
          className
        )}
        aria-label="Loading status"
      />
    )
  }

  const normalizedStatus = status
    ? String(status).toLowerCase().replace(/\s+/g, '_').trim()
    : ''
  const config: StatusConfig = STATUS_CONFIG[normalizedStatus] ?? DEFAULT_CONFIG
  const Icon = config.icon
  const displayLabel = labelOverride ?? config.label
  const variant = isError ? 'destructive' : config.variant

  if (!normalizedStatus && !labelOverride) {
    return (
      <Badge
        variant="outline"
        className={cn(
          'inline-flex items-center gap-2 border-border bg-muted/30 text-muted-foreground',
          size === 'sm' && 'gap-1.5 px-2 py-0 text-xs',
          size === 'md' && 'gap-2 px-2.5 py-0.5 text-xs',
          size === 'lg' && 'gap-2 px-3 py-1 text-sm',
          'transition-all duration-200 hover:shadow-sm',
          className
        )}
        role="status"
        aria-label="Status: empty"
      >
        {showIcon && (
          <HelpCircle
            className={cn(
              'shrink-0 text-muted-foreground',
              size === 'sm' && 'h-3 w-3',
              size === 'md' && 'h-4 w-4',
              size === 'lg' && 'h-4 w-4'
            )}
            aria-hidden
          />
        )}
        <span>—</span>
      </Badge>
    )
  }

  return (
    <Badge
      variant={variant}
      className={cn(
        'inline-flex items-center gap-2 border shadow-sm',
        size === 'sm' && 'gap-1.5 px-2 py-0 text-xs',
        size === 'md' && 'gap-2 px-2.5 py-0.5 text-xs',
        size === 'lg' && 'gap-2 px-3 py-1 text-sm',
        'transition-all duration-200 hover:shadow-md hover:scale-[1.02]',
        className
      )}
      role="status"
      aria-label={`Status: ${displayLabel}`}
    >
      {showIcon && (
        <Icon
          className={cn(
            'shrink-0',
            config.iconClassName,
            size === 'sm' && 'h-3 w-3',
            size === 'md' && 'h-4 w-4',
            size === 'lg' && 'h-4 w-4',
            Icon === Loader2 && 'animate-spin'
          )}
          aria-hidden
        />
      )}
      <span className="capitalize">{displayLabel}</span>
    </Badge>
  )
}
