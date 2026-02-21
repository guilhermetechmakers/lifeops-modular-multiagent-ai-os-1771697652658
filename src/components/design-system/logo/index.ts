/**
 * LifeOps Brand Logo System
 *
 * Primary logo, icon, and wordmark in light/dark/gradient variants and multiple sizes.
 * Use across the app for consistent branding.
 *
 * @example
 * // Full logo in nav
 * <LifeOpsLogo size="lg" variant="gradient" />
 *
 * @example
 * // Icon only for collapsed sidebar
 * <LifeOpsLogo iconOnly size="md" variant="gradient" />
 *
 * @example
 * // Wordmark for light backgrounds
 * <LifeOpsWordmark variant="dark" size="xl" />
 */

export { LifeOpsIcon } from './LifeOpsIcon'
export type { LifeOpsIconProps } from './LifeOpsIcon'

export { LifeOpsWordmark } from './LifeOpsWordmark'
export type { LifeOpsWordmarkProps } from './LifeOpsWordmark'

export { LifeOpsLogo } from './LifeOpsLogo'
export type { LifeOpsLogoProps } from './LifeOpsLogo'

export type { LogoVariant, LogoSize, LogoBaseProps } from './types'
export { LOGO_SIZE_MAP } from './types'
