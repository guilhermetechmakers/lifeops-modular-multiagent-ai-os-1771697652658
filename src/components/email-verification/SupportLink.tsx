import { Link } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SupportLinkProps {
  className?: string
}

export function SupportLink({ className }: SupportLinkProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-muted/30 p-4 transition-all duration-200 hover:border-primary/30',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
          <HelpCircle className="h-5 w-5 text-muted-foreground" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground">
            Having trouble verifying?
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            If the link expired or you didn&apos;t receive the email,{' '}
            <Link
              to="/support"
              className="text-primary hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              contact support
            </Link>
            {' '}for help with verification issues.
          </p>
        </div>
      </div>
    </div>
  )
}
