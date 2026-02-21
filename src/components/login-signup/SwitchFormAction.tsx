import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type FormMode = 'login' | 'signup'

interface SwitchFormActionProps {
  mode: FormMode
  onSwitch: (mode: FormMode) => void
  className?: string
}

export function SwitchFormAction({ mode, onSwitch, className }: SwitchFormActionProps) {
  return (
    <p className={cn('text-center text-sm text-muted-foreground', className)}>
      {mode === 'login' ? (
        <>
          Don&apos;t have an account?{' '}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-primary hover:underline font-medium"
            onClick={() => onSwitch('signup')}
          >
            Sign up
          </Button>
        </>
      ) : (
        <>
          Already have an account?{' '}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-primary hover:underline font-medium"
            onClick={() => onSwitch('login')}
          >
            Sign in
          </Button>
        </>
      )}
    </p>
  )
}
