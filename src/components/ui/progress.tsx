import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const progressRootVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-muted transition-all duration-300',
  {
    variants: {
      variant: {
        default: '',
        success: '',
        warning: '',
        destructive: '',
      },
      size: {
        sm: 'h-1.5 min-h-[6px]',
        default: 'h-2 min-h-[8px]',
        lg: 'h-3 min-h-[12px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const progressIndicatorVariants = cva(
  'h-full w-full flex-1 transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        success: 'bg-success',
        warning: 'bg-warning',
        destructive: 'bg-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ProgressProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
      'value'
    >,
    VariantProps<typeof progressRootVariants> {
  /** Progress value 0-100. Undefined for indeterminate/loading state. */
  value?: number
  /** When true, shows indeterminate loading animation. Overrides value. */
  isLoading?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value,
      isLoading = false,
      variant = 'default',
      size = 'default',
      ...props
    },
    ref
  ) => {
    const isIndeterminate = isLoading || value === undefined

    return (
      <ProgressPrimitive.Root
        ref={ref}
        value={isIndeterminate ? undefined : value}
        max={isIndeterminate ? undefined : props.max ?? 100}
        className={cn(progressRootVariants({ variant, size }), className)}
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-valuemin={isIndeterminate ? undefined : 0}
        aria-valuemax={isIndeterminate ? undefined : props.max ?? 100}
        aria-busy={isIndeterminate}
        {...props}
      >
        {isIndeterminate ? (
          <div
            className={cn(
              'h-full w-full animate-shimmer bg-gradient-to-r from-muted via-primary/30 to-muted bg-[length:200%_100%]',
              'rounded-full'
            )}
            role="progressbar"
            aria-label="Loading"
          />
        ) : (
          <ProgressPrimitive.Indicator
            className={cn(progressIndicatorVariants({ variant }))}
            style={{
              transform: `translateX(-${100 - (value ?? 0)}%)`,
            }}
          />
        )}
      </ProgressPrimitive.Root>
    )
  }
)
Progress.displayName = ProgressPrimitive.Root.displayName

export interface ProgressWithLabelProps extends ProgressProps {
  /** Optional label shown above the progress bar */
  label?: React.ReactNode
  /** Optional value display (e.g., "65%" or custom content) */
  valueLabel?: React.ReactNode
  /** Optional error state - when true, shows error UI instead of progress */
  hasError?: boolean
  /** Retry callback when in error state */
  onRetry?: () => void
  /** Optional id for label association */
  id?: string
}

const ProgressWithLabel = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressWithLabelProps
>(
  (
    {
      label,
      valueLabel,
      hasError = false,
      onRetry,
      id: providedId,
      className,
      ...progressProps
    },
    ref
  ) => {
    const id = React.useId()
    const progressId = providedId ?? id

    if (hasError) {
      return (
        <div
          className={cn(
            'flex flex-col items-center justify-center py-8 px-4 rounded-xl',
            'border border-destructive/30 bg-destructive/5',
            'animate-fade-in transition-all duration-300'
          )}
          role="alert"
        >
          <AlertCircle
            className="h-10 w-10 text-destructive mb-3"
            aria-hidden
          />
          <p className="text-sm font-medium text-foreground">Failed to load progress</p>
          <p className="text-xs text-muted-foreground mt-1">Something went wrong</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={onRetry}
              aria-label="Retry loading progress"
            >
              Retry
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="w-full space-y-2">
        {(label || valueLabel) && (
          <div className="flex items-center justify-between gap-4 min-h-[20px]">
            {label && (
              <span
                id={`${progressId}-label`}
                className="text-sm font-medium text-foreground"
              >
                {label}
              </span>
            )}
            {valueLabel !== undefined && (
              <span className="text-sm text-muted-foreground tabular-nums">
                {valueLabel}
              </span>
            )}
          </div>
        )}
        <Progress
          ref={ref}
          id={progressId}
          aria-labelledby={label ? `${progressId}-label` : undefined}
          className={className}
          {...progressProps}
        />
      </div>
    )
  }
)
ProgressWithLabel.displayName = 'ProgressWithLabel'

export { Progress, ProgressWithLabel }
