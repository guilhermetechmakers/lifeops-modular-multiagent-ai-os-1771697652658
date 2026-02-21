import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw, Home, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * Server Error (500) page.
 * Uses design tokens only, proper heading hierarchy (h1 → h2), shadcn/ui, Lucide icons.
 * Mobile-first responsive with Tailwind animations.
 */
export function ServerErrorPage() {
  const handleRetry = () => window.location.reload()

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center p-4 sm:p-6',
        'bg-background text-foreground',
        'relative overflow-hidden'
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Gradient overlay using design tokens */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-primary/5 animate-pulse"
        aria-hidden
      />

      <Card className="relative w-full max-w-lg animate-fade-in border-border bg-card shadow-card">
        <CardHeader className="text-center pb-2">
          <div
            className={cn(
              'mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full',
              'bg-destructive/10 border-2 border-destructive/20',
              'transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-destructive/20'
            )}
          >
            <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-destructive" aria-hidden />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-2 bg-clip-text text-transparent bg-gradient-to-r from-destructive to-destructive/70">
            500
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1">
            Server Error
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground text-center max-w-md mx-auto">
            Something went wrong on our end. Our team has been notified. You can try again or return to safety.
          </p>

          <section aria-labelledby="what-you-can-do">
            <p
              id="what-you-can-do"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center mb-2"
            >
              What you can do
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 text-left max-w-sm mx-auto list-disc list-inside">
              <li>Refresh the page to retry your request</li>
              <li>Return to the dashboard or home</li>
              <li>Contact support if the issue persists</li>
            </ul>
          </section>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
            <Button
              onClick={handleRetry}
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg min-h-[44px]"
              aria-label="Try again"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
            <Button
              variant="outline"
              asChild
              className="gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md min-h-[44px]"
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md min-h-[44px]"
            >
              <Link to="/docs-help">
                <HelpCircle className="h-4 w-4" />
                Get Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
