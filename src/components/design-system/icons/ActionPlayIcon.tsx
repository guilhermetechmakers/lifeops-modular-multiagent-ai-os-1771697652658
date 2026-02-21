import { cn } from '@/lib/utils'
import type { ModuleIconBaseProps } from './types'
import { MODULE_ICON_SIZE_MAP } from './types'

/**
 * Action icon - play, start, run.
 */
export function ActionPlayIcon({
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
      fill={useCurrentColor ? 'currentColor' : 'rgb(var(--primary))'}
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M8 5v14l11-7L8 5Z" />
    </svg>
  )
}
