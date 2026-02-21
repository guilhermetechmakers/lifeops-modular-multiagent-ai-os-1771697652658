import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const Tabs = TabsPrimitive.Root

export type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card p-1 text-muted-foreground shadow-card transition-all duration-300',
      'focus-visible:outline-none',
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  /** Accessible label for screen readers. Falls back to string children when not provided. */
  ariaLabel?: string
}

const getAriaLabel = (
  props: TabsTriggerProps,
  children: React.ReactNode
): string => {
  if (props['aria-label']) return props['aria-label'] as string
  if (props.ariaLabel) return props.ariaLabel
  if (typeof children === 'string' && children.trim()) return children.trim()
  if (props.value && typeof props.value === 'string') {
    return props.value.charAt(0).toUpperCase() + props.value.slice(1).replace(/[-_]/g, ' ')
  }
  return 'Tab'
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, children, ariaLabel, ...triggerProps }, ref) => {
  const computedAriaLabel = getAriaLabel(
    { ...triggerProps, ariaLabel } as TabsTriggerProps,
    children
  )

  return (
    <TabsPrimitive.Trigger asChild ref={ref} {...triggerProps}>
      <Button
        variant="ghost"
        size="sm"
        aria-label={computedAriaLabel}
        className={cn(
          'h-8 rounded-lg px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
          'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
          className
        )}
      >
        {children}
      </Button>
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
