import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LifeOpsIcon } from './LifeOpsIcon'
import { LifeOpsWordmark } from './LifeOpsWordmark'
import type { LogoBaseProps, LogoSize } from './types'
import { LOGO_SIZE_MAP } from './types'

export interface LifeOpsLogoProps extends LogoBaseProps {
  /** Show icon only (collapsed state) */
  iconOnly?: boolean
  /** Render as link to home */
  asLink?: boolean
  /** Gap between icon and wordmark in pixels */
  gap?: number
}

const ICON_WORDMARK_GAP: Record<LogoSize, number> = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
}

/**
 * LifeOps full logo - icon + wordmark.
 * Primary brand asset for navigation, headers, and marketing.
 */
export function LifeOpsLogo({
  variant = 'gradient',
  size = 'md',
  iconOnly = false,
  asLink = true,
  gap,
  className,
}: LifeOpsLogoProps) {
  const gapPx = gap ?? ICON_WORDMARK_GAP[size]

  const content = iconOnly ? (
    <LifeOpsIcon variant={variant} size={size} aria-label="LifeOps" />
  ) : (
    <span
      className="inline-flex items-center"
      style={{ gap: `${gapPx}px` }}
    >
      <LifeOpsIcon variant={variant} size={size} aria-hidden />
      <LifeOpsWordmark variant={variant} size={size} asLink={false} />
    </span>
  )

  if (asLink) {
    return (
      <Link
        to="/"
        className={cn(
          'inline-flex items-center hover:opacity-90 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg',
          className
        )}
        aria-label="LifeOps - Home"
      >
        {content}
      </Link>
    )
  }

  return <span className={cn('inline-flex items-center', className)}>{content}</span>
}
