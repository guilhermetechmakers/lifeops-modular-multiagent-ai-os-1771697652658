import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { cn } from '@/lib/utils'

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    acceptTos: z.boolean().refine((v) => v === true, 'You must accept the terms'),
  })

export type SignupFormData = z.infer<typeof schema>

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>
  isSubmitting?: boolean
  className?: string
}

export function SignupForm({ onSubmit, isSubmitting = false, className }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(schema),
    defaultValues: { acceptTos: false },
  })

  const password = watch('password')
  const acceptTos = watch('acceptTos')

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="signup-name">Name</Label>
        <Input
          id="signup-name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          {...register('name')}
          className={cn(
            'transition-colors duration-200',
            errors.name && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        {errors.name && (
          <p className="text-sm text-destructive ">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
          className={cn(
            'transition-colors duration-200',
            errors.email && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        {errors.email && (
          <p className="text-sm text-destructive ">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
          className={cn(
            'transition-colors duration-200',
            errors.password && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        <PasswordStrengthMeter password={password} />
        {errors.password && (
          <p className="text-sm text-destructive ">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="flex items-start gap-2">
        <Checkbox
          id="signup-tos"
          checked={acceptTos}
          onCheckedChange={(checked) => setValue('acceptTos', !!checked)}
          className="mt-0.5 transition-transform duration-200 hover:scale-105"
        />
        <label htmlFor="signup-tos" className="text-sm text-muted-foreground cursor-pointer leading-tight">
          I accept the{' '}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>
      {errors.acceptTos && (
        <p className="text-sm text-destructive ">
          {errors.acceptTos.message}
        </p>
      )}
      <Button
        type="submit"
        className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating account...' : 'Sign up'}
      </Button>
    </form>
  )
}
