/**
 * LifeOps Brand Logo System - Type definitions
 */

export type LogoVariant = 'light' | 'dark' | 'gradient'

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const LOGO_SIZE_MAP: Record<LogoSize, number> = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
}

export interface LogoBaseProps {
  /** Visual variant: light (on dark bg), dark (on light bg), gradient (primary→accent) */
  variant?: LogoVariant
  /** Size preset */
  size?: LogoSize
  /** Additional class names */
  className?: string
}
