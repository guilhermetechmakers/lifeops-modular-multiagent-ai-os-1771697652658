import { cn } from '@/lib/utils'
import type { ModuleIconBaseProps } from './types'
import { MODULE_ICON_SIZE_MAP } from './types'

/**
 * Action icon - approve, confirm, complete.
 */
export function ActionApproveIcon({
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
      fill={useCurrentColor ? 'currentColor' : 'rgb(var(--success))'}
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z" />
    </svg>
  )
}
