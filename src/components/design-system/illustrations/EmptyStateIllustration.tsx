import { useId } from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateIllustrationProps {
  className?: string
  /** Variant: default (inbox), projects, content, finance, health */
  variant?: 'default' | 'projects' | 'content' | 'finance' | 'health'
  /** Size preset */
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_MAP = {
  sm: 160,
  md: 200,
  lg: 240,
}

/**
 * Empty state illustration - helpful visual for empty lists and dashboards.
 * Per Design Reference: icon + heading + description + CTA pattern.
 */
export function EmptyStateIllustration({
  className,
  variant = 'default',
  size = 'md',
}: EmptyStateIllustrationProps) {
  const id = useId()
  const px = SIZE_MAP[size]

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 opacity-60', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`empty-grad-${id}`} x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(var(--primary))" stopOpacity="0.3" />
          <stop offset="1" stopColor="rgb(var(--accent))" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Soft background circle */}
      <circle cx="100" cy="100" r="90" fill={`url(#empty-grad-${id})`} />

      {variant === 'default' && (
        <>
          {/* Inbox / empty box */}
          <rect x="50" y="60" width="100" height="80" rx="8" stroke="rgb(var(--border))" strokeWidth="2" fill="rgb(var(--card))" fillOpacity="0.5" />
          <path d="M50 70 L100 95 L150 70" stroke="rgb(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeOpacity="0.6" />
          <circle cx="100" cy="130" r="8" fill="rgb(var(--primary))" fillOpacity="0.4" />
        </>
      )}

      {variant === 'projects' && (
        <>
          <rect x="55" y="65" width="40" height="50" rx="6" stroke="rgb(var(--border))" strokeWidth="2" fill="rgb(var(--card))" fillOpacity="0.5" />
          <rect x="105" y="75" width="40" height="40" rx="6" stroke="rgb(var(--border))" strokeWidth="2" fill="rgb(var(--card))" fillOpacity="0.5" />
          <path d="M75 90 L95 90" stroke="rgb(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
          <path d="M115 95 L135 95" stroke="rgb(var(--accent))" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
        </>
      )}

      {variant === 'content' && (
        <>
          <rect x="55" y="55" width="90" height="110" rx="8" stroke="rgb(var(--border))" strokeWidth="2" fill="rgb(var(--card))" fillOpacity="0.5" />
          <path d="M65 75 L135 75" stroke="rgb(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
          <path d="M65 95 L120 95" stroke="rgb(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
          <path d="M65 115 L100 115" stroke="rgb(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
          <circle cx="165" cy="85" r="12" fill="rgb(var(--accent))" fillOpacity="0.3" />
        </>
      )}

      {variant === 'finance' && (
        <>
          <rect x="50" y="70" width="100" height="70" rx="8" stroke="rgb(var(--border))" strokeWidth="2" fill="rgb(var(--card))" fillOpacity="0.5" />
          <path d="M60 95 L140 95" stroke="rgb(var(--success))" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
          <path d="M60 115 L120 115" stroke="rgb(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
          <rect x="85" y="125" width="30" height="20" rx="4" fill="rgb(var(--success))" fillOpacity="0.3" stroke="rgb(var(--success))" strokeOpacity="0.5" strokeWidth="1" />
        </>
      )}

      {variant === 'health' && (
        <>
          <path
            fill="rgb(var(--primary))"
            fillOpacity="0.3"
            stroke="rgb(var(--primary))"
            strokeOpacity="0.5"
            strokeWidth="2"
            d="M100 75c-8 0-15 6-15 14 0 12 15 28 15 28s15-16 15-28c0-8-7-14-15-14Z"
          />
          <circle cx="100" cy="140" r="15" stroke="rgb(var(--accent))" strokeWidth="2" fill="none" strokeOpacity="0.4" />
        </>
      )}
    </svg>
  )
}
