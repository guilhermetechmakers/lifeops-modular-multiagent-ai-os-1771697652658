/**
 * Design tokens for charts and components requiring RGB color values.
 * Values match CSS custom properties in src/index.css.
 * Use these instead of hardcoded hex/rgb values for consistency.
 */
export const chartColors = {
  primary: 'rgb(var(--primary))',
  accent: 'rgb(var(--accent))',
  warning: 'rgb(var(--warning))',
  success: 'rgb(var(--success))',
} as const
