import { Link } from 'react-router-dom'
import { Home, LayoutDashboard, HelpCircle, FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ErrorMessageProps {
  className?: string
}

export function ErrorMessage({ className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center text-center animate-fade-in',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 ring-4 ring-primary/10 animate-slide-up">
        <FileQuestion className="h-12 w-12 text-primary" aria-hidden />
      </div>
      <h1 className="text-6xl sm:text-7xl font-bold text-gradient mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
        404
      </h1>
      <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
        Page not found
      </h2>
      <p className="text-muted-foreground text-base sm:text-lg max-w-md mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Try one of the options below to get back on track.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/">
          <Button
            size="lg"
            className="gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-card-hover"
          >
            <Home className="h-5 w-5" aria-hidden />
            Go Home
          </Button>
        </Link>
        <Link to="/dashboard/overview">
          <Button
            variant="secondary"
            size="lg"
            className="gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <LayoutDashboard className="h-5 w-5" aria-hidden />
            Dashboard
          </Button>
        </Link>
        <Link to="/support">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <HelpCircle className="h-5 w-5" aria-hidden />
            Support
          </Button>
        </Link>
      </div>
    </div>
  )
}
