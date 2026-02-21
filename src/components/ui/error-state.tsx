import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ErrorStateProps {
  heading?: string
  description?: string
  onRetry?: () => void
  className?: string
}

/**
 * Standardized error state component per Design Reference:
 * Error display with retry button for failed data fetches.
 */
export function ErrorState({
  heading = 'Something went wrong',
  description = 'Failed to load data. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 rounded-2xl border border-destructive/30',
        'bg-destructive/5 transition-all duration-300 hover:border-destructive/40',
        'animate-fade-in',
        className
      )}
    >
      <AlertCircle className="h-12 w-12 text-destructive mb-4" aria-hidden />
      <h3 className="font-semibold text-lg">{heading}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      {onRetry && (
        <Button
          variant="outline"
          className="mt-4 transition-all duration-200 hover:scale-[1.02]"
          onClick={onRetry}
        >
          Retry
        </Button>
      )}
    </div>
  )
}
