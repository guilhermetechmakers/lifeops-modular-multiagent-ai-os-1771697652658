import { useId } from 'react'
import { cn } from '@/lib/utils'
import type { ModuleIconBaseProps } from './types'
import { MODULE_ICON_SIZE_MAP } from './types'

/**
 * Approvals module icon - checkmark, human-in-the-loop.
 */
export function ModuleApprovalsIcon({
  size = 'md',
  className,
  useCurrentColor = false,
}: ModuleIconBaseProps) {
  const id = useId()
  const px = MODULE_ICON_SIZE_MAP[size]
  const fill = useCurrentColor ? 'currentColor' : `url(#module-approvals-${id})`

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      {!useCurrentColor && (
        <defs>
          <linearGradient id={`module-approvals-${id}`} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgb(var(--accent))" />
            <stop offset="1" stopColor="rgb(var(--primary))" />
          </linearGradient>
        </defs>
      )}
      <path
        fill={fill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z"
      />
    </svg>
  )
}
