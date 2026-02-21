import { useId } from 'react'
import { cn } from '@/lib/utils'
import type { ModuleIconBaseProps } from './types'
import { MODULE_ICON_SIZE_MAP } from './types'

/**
 * Content module icon - pipeline, documents, creation.
 */
export function ModuleContentIcon({
  size = 'md',
  className,
  useCurrentColor = false,
}: ModuleIconBaseProps) {
  const id = useId()
  const px = MODULE_ICON_SIZE_MAP[size]
  const fill = useCurrentColor ? 'currentColor' : `url(#module-content-${id})`

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
          <linearGradient id={`module-content-${id}`} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgb(var(--accent))" />
            <stop offset="1" stopColor="rgb(var(--accent))" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      )}
      <path
        fill={fill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6Zm0 2h5v6h7v10H6V4Zm7 1.414L18.586 8H13V5.414ZM10 12h4v2h-4v-2Zm0 4h4v2h-4v-2Z"
      />
    </svg>
  )
}
