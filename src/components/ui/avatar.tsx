import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      'sm:h-10 sm:w-10',
      'transition-shadow duration-200 hover:shadow-card',
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

export interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {
  /** Descriptive alt text for the image. Defaults to "User avatar" when not provided. */
  alt?: string
  /** Optional name used to generate descriptive alt text when alt is not provided. */
  name?: string
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, alt, name, ...props }, ref) => {
  const descriptiveAlt =
    alt?.trim() || (name ? `Avatar for ${name}` : 'User avatar')

  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn('aspect-square h-full w-full object-cover', className)}
      alt={descriptiveAlt}
      {...props}
    />
  )
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, children, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    delayMs={600}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full',
      'bg-muted text-muted-foreground',
      'transition-colors duration-200',
      className
    )}
    {...props}
  >
    {children ?? (
      <User
        className="h-5 w-5 sm:h-6 sm:w-6"
        aria-hidden
      />
    )}
  </AvatarPrimitive.Fallback>
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
