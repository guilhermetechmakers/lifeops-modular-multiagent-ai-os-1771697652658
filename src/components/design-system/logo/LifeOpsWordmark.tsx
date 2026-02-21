import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { LogoBaseProps, LogoSize } from './types'
import { LOGO_SIZE_MAP } from './types'

export interface LifeOpsWordmarkProps extends LogoBaseProps {
  /** Render as link to home */
  asLink?: boolean
}

const WORDMARK_SIZE_CLASSES: Record<LogoSize, string> = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
}

/**
 * LifeOps wordmark - "LifeOps" text in brand typography.
 * Use for headers, navigation, or when icon alone is insufficient.
 */
export function LifeOpsWordmark({
  variant = 'gradient',
  size = 'md',
  className,
  asLink = false,
}: LifeOpsWordmarkProps) {
  const variantClasses = {
    light: 'text-white',
    dark: 'text-foreground',
    gradient: 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent',
  }

  const content = (
    <span
      className={cn(
        'font-bold tracking-tight',
        WORDMARK_SIZE_CLASSES[size],
        variantClasses[variant],
        className
      )}
    >
      LifeOps
    </span>
  )

  if (asLink) {
    return (
      <Link to="/" className="inline-flex items-center hover:opacity-90 transition-opacity duration-200">
        {content}
      </Link>
    )
  }

  return content
}
