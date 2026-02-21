import { cva } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow-primary/10',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive text-primary-foreground shadow-destructive/10',
        outline: 'text-foreground border-border bg-transparent',
        success:
          'border-transparent bg-success/20 text-success',
        warning:
          'border-transparent bg-warning/20 text-warning',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)
