import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'aria-invalid'> {
  /** Accessible label - renders associated Label when provided. Use aria-label for icon-only inputs. */
  label?: string
  /** Error message - displays below input and applies error styling */
  error?: string
  /** Loading state - disables input and shows loading indicator */
  isLoading?: boolean
  /** Optional helper text displayed below the input */
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      isLoading,
      helperText,
      id: idProp,
      disabled,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const id = idProp ?? generatedId

    const inputElement = (
      <div className="relative w-full">
        <input
          type={type}
          id={id}
          className={cn(
            'flex h-10 w-full min-w-0 rounded-lg border px-3 py-2 text-sm ring-offset-background transition-colors duration-200',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'bg-[rgb(var(--input-background))]',
            error
              ? 'border-destructive focus-visible:ring-destructive/50'
              : 'border-input',
            (disabled || isLoading) && 'opacity-70',
            className
          )}
          ref={ref}
          disabled={disabled || isLoading}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [error && `${id}-error`, helperText && `${id}-helper`]
              .filter(Boolean)
              .join(' ') || undefined
          }
          aria-label={!label ? ariaLabel : undefined}
          aria-labelledby={label ? undefined : ariaLabelledby}
          {...props}
        />
        {isLoading && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden
          >
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    )

    const errorElement = error && (
      <p
        id={`${id}-error`}
        className="mt-1.5 text-sm text-destructive"
        role="alert"
      >
        {error}
      </p>
    )

    const helperElement = helperText && !error && (
      <p id={`${id}-helper`} className="mt-1.5 text-sm text-muted-foreground">
        {helperText}
      </p>
    )

    if (label) {
      return (
        <div className="space-y-2 w-full">
          <Label htmlFor={id} className={error ? 'text-destructive' : undefined}>
            {label}
          </Label>
          {inputElement}
          {errorElement}
          {helperElement}
        </div>
      )
    }

    return (
      <div className="space-y-1.5 w-full">
        {inputElement}
        {errorElement}
        {helperElement}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
