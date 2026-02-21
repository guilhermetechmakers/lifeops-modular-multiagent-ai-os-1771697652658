import { Shield, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OAuthConsentNoteProps {
  className?: string
}

export function OAuthConsentNote({ className }: OAuthConsentNoteProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground',
        className
      )}
    >
      <div className="flex gap-2">
        <Shield className="h-4 w-4 shrink-0 mt-0.5 text-primary/80" aria-hidden />
        <div className="space-y-1">
          <p className="font-medium text-foreground/90">Connected accounts</p>
          <p>
            When you sign in with Google, Microsoft, or GitHub, we securely connect your account.
            We only access the information you authorize. Your data stays protected and you can
            disconnect at any time in settings.
          </p>
          <p className="flex items-center gap-1.5 pt-1">
            <Link2 className="h-3.5 w-3.5" />
            <span>OAuth 2.0 / OpenID Connect — industry-standard security</span>
          </p>
        </div>
      </div>
    </div>
  )
}
