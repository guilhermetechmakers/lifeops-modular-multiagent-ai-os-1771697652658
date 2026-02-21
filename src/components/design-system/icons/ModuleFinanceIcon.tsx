import { useId } from 'react'
import { cn } from '@/lib/utils'
import type { ModuleIconBaseProps } from './types'
import { MODULE_ICON_SIZE_MAP } from './types'

/**
 * Finance module icon - wallet, bookkeeping, forecasting.
 */
export function ModuleFinanceIcon({
  size = 'md',
  className,
  useCurrentColor = false,
}: ModuleIconBaseProps) {
  const id = useId()
  const px = MODULE_ICON_SIZE_MAP[size]
  const fill = useCurrentColor ? 'currentColor' : `url(#module-finance-${id})`

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
          <linearGradient id={`module-finance-${id}`} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgb(var(--success))" />
            <stop offset="1" stopColor="rgb(var(--success))" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      )}
      <path
        fill={fill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Zm2 0v16h12V4H6Zm2 2h2v2H8V6Zm0 4h2v2H8v-2Zm0 4h2v2H8v-2Zm6-8h2v2h-2V6Zm0 4h2v2h-2v-2Zm0 4h2v2h-2v-2Z"
      />
    </svg>
  )
}
