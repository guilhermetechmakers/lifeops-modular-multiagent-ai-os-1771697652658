import { useId } from 'react'
import { cn } from '@/lib/utils'

export interface HeroIllustrationProps {
  className?: string
  /** Size preset: sm, md, lg */
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_MAP = {
  sm: 320,
  md: 400,
  lg: 480,
}

/**
 * Custom hero illustration: AI operations, multi-agent orchestration, bento-style dashboard.
 * Used on the landing page hero section.
 */
export function HeroIllustration({ className, size = 'lg' }: HeroIllustrationProps) {
  const id = useId()
  const px = SIZE_MAP[size]

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`hero-grad-1-${id}`} x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(var(--primary))" stopOpacity="0.2" />
          <stop offset="1" stopColor="rgb(var(--accent))" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id={`hero-grad-2-${id}`} x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(var(--primary))" />
          <stop offset="1" stopColor="rgb(var(--accent))" />
        </linearGradient>
        <filter id={`hero-glow-${id}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Bento grid background */}
      <rect width="400" height="400" rx="24" fill={`url(#hero-grad-1-${id})`} />
      <rect x="16" y="16" width="368" height="368" rx="16" fill="rgb(var(--card))" fillOpacity="0.6" stroke="rgb(var(--border))" strokeOpacity="0.5" strokeWidth="1" />

      {/* Bento cells - top row */}
      <rect x="32" y="32" width="104" height="104" rx="12" fill="rgb(var(--primary))" fillOpacity="0.15" stroke="rgb(var(--primary))" strokeOpacity="0.3" strokeWidth="1" className="transition-all duration-300" />
      <rect x="144" y="32" width="224" height="104" rx="12" fill="rgb(var(--accent))" fillOpacity="0.1" stroke="rgb(var(--accent))" strokeOpacity="0.25" strokeWidth="1" />

      {/* Bento cells - middle row */}
      <rect x="32" y="144" width="224" height="104" rx="12" fill="rgb(var(--accent))" fillOpacity="0.08" stroke="rgb(var(--accent))" strokeOpacity="0.2" strokeWidth="1" />
      <rect x="264" y="144" width="104" height="104" rx="12" fill="rgb(var(--primary))" fillOpacity="0.12" stroke="rgb(var(--primary))" strokeOpacity="0.25" strokeWidth="1" />

      {/* Bento cells - bottom row (full width) */}
      <rect x="32" y="256" width="336" height="112" rx="12" fill="rgb(var(--card))" fillOpacity="0.8" stroke="rgb(var(--border))" strokeOpacity="0.4" strokeWidth="1" />

      {/* AI node icons in cells - L shape (LifeOps mark) */}
      <g transform="translate(72, 72)">
        <path fill={`url(#hero-grad-2-${id})`} fillRule="evenodd" clipRule="evenodd" d="M4 2h2v10h6v2H4V2Z" />
        <circle cx="14" cy="6" r="2" fill={`url(#hero-grad-2-${id})`} />
      </g>

      {/* Agent nodes - small circles */}
      <circle cx="200" cy="80" r="6" fill="rgb(var(--primary))" fillOpacity="0.6" filter={`url(#hero-glow-${id})`} />
      <circle cx="280" cy="80" r="5" fill="rgb(var(--accent))" fillOpacity="0.6" filter={`url(#hero-glow-${id})`} />
      <circle cx="320" cy="80" r="4" fill="rgb(var(--accent))" fillOpacity="0.5" filter={`url(#hero-glow-${id})`} />

      {/* Connection lines (subtle) */}
      <path d="M200 86 L200 130" stroke="rgb(var(--primary))" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />
      <path d="M280 86 L280 130" stroke="rgb(var(--accent))" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />

      {/* Bottom bar - cron/approval indicators */}
      <rect x="48" y="280" width="48" height="8" rx="4" fill="rgb(var(--primary))" fillOpacity="0.4" />
      <rect x="108" y="280" width="64" height="8" rx="4" fill="rgb(var(--accent))" fillOpacity="0.3" />
      <rect x="184" y="280" width="40" height="8" rx="4" fill="rgb(var(--success))" fillOpacity="0.4" />
    </svg>
  )
}
