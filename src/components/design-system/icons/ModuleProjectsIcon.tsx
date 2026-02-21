import { useId } from 'react'
import { cn } from '@/lib/utils'
import type { ModuleIconBaseProps } from './types'
import { MODULE_ICON_SIZE_MAP } from './types'

/**
 * Projects module icon - roadmap, tickets, kanban.
 */
export function ModuleProjectsIcon({
  size = 'md',
  className,
  useCurrentColor = false,
}: ModuleIconBaseProps) {
  const id = useId()
  const px = MODULE_ICON_SIZE_MAP[size]
  const fill = useCurrentColor ? 'currentColor' : `url(#module-projects-${id})`

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
          <linearGradient id={`module-projects-${id}`} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgb(var(--primary))" />
            <stop offset="1" stopColor="rgb(var(--primary))" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      )}
      <path
        fill={fill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Zm2 0v4h8V4H6Zm0 6v8h8v-8H6Zm10-4v2h2V6h-2Zm0 4v2h2v-2h-2Zm0 4v2h2v-2h-2Z"
      />
    </svg>
  )
}
