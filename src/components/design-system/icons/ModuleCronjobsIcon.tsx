import { useId } from 'react'
import { cn } from '@/lib/utils'
import type { ModuleIconBaseProps } from './types'
import { MODULE_ICON_SIZE_MAP } from './types'

/**
 * Cronjobs module icon - clock, schedule, automation.
 */
export function ModuleCronjobsIcon({
  size = 'md',
  className,
  useCurrentColor = false,
}: ModuleIconBaseProps) {
  const id = useId()
  const px = MODULE_ICON_SIZE_MAP[size]
  const fill = useCurrentColor ? 'currentColor' : `url(#module-cronjobs-${id})`

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
          <linearGradient id={`module-cronjobs-${id}`} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgb(var(--primary))" />
            <stop offset="1" stopColor="rgb(var(--accent))" />
          </linearGradient>
        </defs>
      )}
      <path
        fill={fill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm1 2v5.414l3.293 3.293a1 1 0 0 1-1.414 1.414l-4-4A1 1 0 0 1 11 11V6a1 1 0 0 1 2 0Z"
      />
    </svg>
  )
}
