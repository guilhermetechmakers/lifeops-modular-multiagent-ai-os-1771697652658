/**
 * LifeOps Module & Action Icon Set - Type definitions
 */

export type ModuleIconSize = 'sm' | 'md' | 'lg'

export const MODULE_ICON_SIZE_MAP: Record<ModuleIconSize, number> = {
  sm: 20,
  md: 24,
  lg: 32,
}

export interface ModuleIconBaseProps {
  size?: ModuleIconSize
  className?: string
  /** Use currentColor for fill (inherits text color) */
  useCurrentColor?: boolean
}
