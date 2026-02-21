import { cn } from '@/lib/utils'
import type { ModuleIconBaseProps } from './types'
import { MODULE_ICON_SIZE_MAP } from './types'

/**
 * Action icon - pause, hold, awaiting.
 */
export function ActionPauseIcon({
  size = 'md',
  className,
  useCurrentColor = false,
}: ModuleIconBaseProps) {
  const px = MODULE_ICON_SIZE_MAP[size]

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill={useCurrentColor ? 'currentColor' : 'rgb(var(--warning))'}
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M6 4h4v16H6V4Zm8 0h4v16h-4V4Z" />
    </svg>
  )
}
