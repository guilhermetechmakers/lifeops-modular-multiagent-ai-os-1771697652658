import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Chrome, Github, Building2, Shield } from 'lucide-react'

interface SSOButtonsProps {
  onGoogle?: () => void
  onMicrosoft?: () => void
  onGitHub?: () => void
  onSAML?: () => void
  showSAML?: boolean
  disabled?: boolean
  className?: string
}

export function SSOButtons({
  onGoogle,
  onMicrosoft,
  onGitHub,
  onSAML,
  showSAML = false,
  disabled = false,
  className,
}: SSOButtonsProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onGoogle}
          disabled={disabled}
          className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
          aria-label="Sign in with Google"
        >
          <Chrome className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Google</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onMicrosoft}
          disabled={disabled}
          className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
          aria-label="Sign in with Microsoft"
        >
          <Building2 className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Microsoft</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onGitHub}
          disabled={disabled}
          className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
          aria-label="Sign in with GitHub"
        >
          <Github className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">GitHub</span>
        </Button>
      </div>
      {showSAML && (
        <Button
          type="button"
          variant="outline"
          onClick={onSAML}
          disabled={disabled}
          className="w-full gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
          aria-label="Sign in with SAML (Enterprise)"
        >
          <Shield className="h-4 w-4" />
          SAML (Enterprise)
        </Button>
      )}
    </div>
  )
}
