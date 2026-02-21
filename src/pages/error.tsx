import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw, Home, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ErrorPage() {
  const handleRetry = () => window.location.reload()

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden"
      role="alert"
      aria-live="assertive"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-primary/5 animate-pulse"
        aria-hidden
      />
      <div className="relative text-center max-w-lg animate-fade-in">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 border-2 border-destructive/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-destructive/20">
          <AlertTriangle className="h-10 w-10 text-destructive" aria-hidden />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-destructive to-destructive/70">
          500
        </h1>
        <p className="text-muted-foreground mb-2 font-medium">
          Server Error
        </p>
        <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
          Something went wrong on our end. Our team has been notified. You can try again or return to safety.
        </p>

        <div className="space-y-4 mb-10">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            What you can do
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 text-left max-w-sm mx-auto">
            <li>• Refresh the page to retry your request</li>
            <li>• Return to the dashboard or home</li>
            <li>• Contact support if the issue persists</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRetry}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button variant="outline" asChild className="gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
            <Link to="/docs-help">
              <HelpCircle className="h-4 w-4" />
              Get Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
