import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const SelectFieldContext = React.createContext<{
  id: string
  label?: string
  error?: string
  isLoading?: boolean
} | null>(null)

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

export interface SelectFieldProps {
  /** Accessible label - renders associated Label when provided. Use aria-label on SelectTrigger for icon-only selects. */
  label?: string
  /** Error message - displays below select and applies error styling */
  error?: string
  /** Loading state - disables select and shows loading indicator */
  isLoading?: boolean
  /** Optional helper text displayed below the select */
  helperText?: string
  /** Optional id for the trigger (for label association). Auto-generated if not provided. */
  id?: string
  children: React.ReactNode
  className?: string
}

function SelectField({
  label,
  error,
  isLoading,
  helperText,
  id: idProp,
  children,
  className,
}: SelectFieldProps) {
  const generatedId = React.useId()
  const id = idProp ?? generatedId

  return (
    <SelectFieldContext.Provider
      value={{ id, label, error, isLoading: isLoading ?? false }}
    >
      <div className={cn('space-y-2 w-full', className)}>
        {label && (
          <Label
            id={id}
            htmlFor={id}
            className={error ? 'text-destructive' : undefined}
          >
            {label}
          </Label>
        )}
        {children}
        {error && (
          <p
            id={`${id}-error`}
            className="mt-1.5 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${id}-helper`} className="mt-1.5 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    </SelectFieldContext.Provider>
  )
}
SelectField.displayName = 'SelectField'

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    /** Accessible label when no visible label. Use with SelectField when label is provided. */
    'aria-label'?: string
    /** ID of element that labels this trigger. Set by SelectField when label is provided. */
    'aria-labelledby'?: string
  }
>(
  (
    {
      className,
      children,
      id: idProp,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      disabled,
      ...props
    },
    ref
  ) => {
    const fieldContext = React.useContext(SelectFieldContext)
    const id = idProp ?? fieldContext?.id
    const hasLabel = Boolean(fieldContext?.label)
    const isLoading = fieldContext?.isLoading ?? false
    const error = fieldContext?.error

    return (
      <SelectPrimitive.Trigger
        ref={ref}
        id={id}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm ring-offset-background transition-colors duration-200',
          'placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          '[&>span]:line-clamp-1',
          'min-h-[2.5rem] sm:min-h-10',
          error
            ? 'border-destructive focus:ring-destructive/50'
            : 'border-input',
          'bg-background',
          isLoading && 'opacity-70',
          className
        )}
        disabled={disabled || isLoading}
        aria-invalid={error ? true : undefined}
        aria-labelledby={hasLabel ? id : ariaLabelledby}
        aria-label={!hasLabel ? ariaLabel : undefined}
        aria-describedby={
          [error && `${id}-error`, ariaDescribedby].filter(Boolean).join(' ') ||
          undefined
        }
        {...props}
      >
      {children}
      {isLoading ? (
        <Loader2
          className="h-4 w-4 shrink-0 animate-spin text-muted-foreground"
          aria-hidden
        />
      ) : (
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </SelectPrimitive.Icon>
      )}
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1 text-muted-foreground',
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1 text-muted-foreground',
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

export interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  /** Message shown when no children/items. Uses design system empty state. */
  emptyMessage?: string
}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, position = 'popper', emptyMessage, ...props }, ref) => {
  const hasItems = React.Children.count(children) > 0

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-card text-foreground shadow-card',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          position === 'popper' && 'animate-fade-in',
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
          )}
        >
          {hasItems ? (
            children
          ) : emptyMessage ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <p className="text-sm text-muted-foreground">{emptyMessage}</p>
            </div>
          ) : (
            children
          )}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
})
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      'py-1.5 pl-8 pr-2 text-sm font-semibold text-foreground',
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors duration-200',
      'focus:bg-accent focus:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'hover:bg-accent/80 hover:text-accent-foreground',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-primary" />
      </SelectPrimitive.ItemIndicator>
    </span>
    {children}
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectField,
}
