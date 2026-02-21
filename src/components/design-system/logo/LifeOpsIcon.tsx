import { useId } from 'react'
import { cn } from '@/lib/utils'
import type { LogoBaseProps, LogoSize } from './types'
import { LOGO_SIZE_MAP } from './types'

export interface LifeOpsIconProps extends LogoBaseProps {
  /** Accessible label for the icon */
  'aria-label'?: string
}

/**
 * LifeOps brand icon/mark - geometric symbol representing AI operations.
 * Use on its own for favicons, app icons, or collapsed navigation.
 */
export function LifeOpsIcon({
  variant = 'gradient',
  size = 'md',
  className,
  'aria-label': ariaLabel = 'LifeOps',
}: LifeOpsIconProps) {
  const gradientId = useId()
  const px = LOGO_SIZE_MAP[size]

  const variantClasses = {
    light: 'text-white',
    dark: 'text-foreground',
    gradient: '',
  }

  const fillValue = variant === 'gradient' ? `url(#${gradientId})` : 'currentColor'

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      className={cn('shrink-0', variantClasses[variant], className)}
      role="img"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="rgb(var(--logo-primary))" />
          <stop offset="1" stopColor="rgb(var(--logo-accent))" />
        </linearGradient>
      </defs>
      {/* Geometric L + node - LifeOps mark (L shape + AI node) */}
      <path
        fill={fillValue}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 4h4v20h8v4H8V4Z"
      />
      <circle cx="22" cy="10" r="4" fill={fillValue} />
    </svg>
  )
}
