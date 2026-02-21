import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/error-state'
import { cn } from '@/lib/utils'

export interface AuthLayoutProps {
  /** Page content (card, form, etc.) */
  children: React.ReactNode
  /** Show loading skeleton instead of children */
  isLoading?: boolean
  /** Show error state instead of children */
  error?: { heading?: string; description?: string; onRetry?: () => void } | null
  /** Page title for accessibility (rendered as sr-only, ensures single h1) */
  pageTitle?: string
  /** Additional class for the outer container */
  className?: string
}

const ICON_SIZE = 'h-6 w-6'

/**
 * Auth layout wrapper for login, signup, forgot-password, reset-password, email-verification.
 * Uses design tokens, consistent icon sizing, and proper heading hierarchy.
 */
export function AuthLayout({
  children,
  isLoading = false,
  error = null,
  pageTitle,
  className,
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-screen flex flex-col bg-background',
        'p-4 sm:p-6 md:p-8',
        className
      )}
    >
      {/* Animated gradient mesh background - design tokens only */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden
      >
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div
          className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-float"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-glow-pulse"
          style={{ animationDelay: '0.5s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      {/* Header: single h1 for page, consistent icon sizing */}
      <header className="flex items-center justify-between w-full max-w-md mx-auto mb-6 sm:mb-8">
        <Link
          to="/"
          className={cn(
            'inline-flex items-center gap-2 rounded-lg',
            'text-foreground hover:text-primary transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          )}
          aria-label="LifeOps - Home"
        >
          <Zap className={cn(ICON_SIZE, 'shrink-0 text-primary')} aria-hidden />
          <span className="font-semibold text-lg">LifeOps</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Link to="/" aria-label="Back to home">
            <Zap className={cn(ICON_SIZE, 'shrink-0 text-muted-foreground')} aria-hidden />
            <span className="hidden sm:inline text-muted-foreground">Home</span>
          </Link>
        </Button>
      </header>

      {/* Main: single h1 for accessibility, content below */}
      <main
        className="flex-1 flex items-center justify-center w-full"
        role="main"
        aria-label={pageTitle ?? 'Authentication'}
      >
        {pageTitle && (
          <h1 className="sr-only">{pageTitle}</h1>
        )}

        {isLoading ? (
          <AuthLayoutSkeleton />
        ) : error ? (
          <div className="w-full max-w-md">
            <ErrorState
              heading={error.heading}
              description={error.description}
              onRetry={error.onRetry}
            />
          </div>
        ) : (
          <div className="w-full max-w-md flex items-center justify-center">
            {children}
          </div>
        )}
      </main>

      {/* Footer link - consistent icon sizing */}
      <footer className="w-full max-w-md mx-auto mt-6 sm:mt-8 text-center">
        <Link
          to="/"
          className={cn(
            'inline-flex items-center justify-center gap-2 text-sm text-muted-foreground',
            'hover:text-primary transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded'
          )}
        >
          <Zap className={cn(ICON_SIZE, 'shrink-0')} aria-hidden />
          <span>Back to LifeOps</span>
        </Link>
      </footer>
    </div>
  )
}

function AuthLayoutSkeleton() {
  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="w-full space-y-4 pt-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
