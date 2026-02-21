import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof schema>

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  isSubmitting?: boolean
  className?: string
}

export function LoginForm({ onSubmit, isSubmitting = false, className }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: { rememberMe: false },
  })

  const rememberMe = watch('rememberMe')

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
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
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          {...register('password')}
          className={cn(
            'transition-colors duration-200',
            errors.password && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        {errors.password && (
          <p className="text-sm text-destructive ">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <Checkbox
            checked={rememberMe}
            onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
            className="transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Remember me
          </span>
        </label>
        <Link
          to="/forgot-password"
          className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
        >
          Forgot password?
        </Link>
      </div>
      <Button
        type="submit"
        className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing in...' : 'Login'}
      </Button>
    </form>
  )
}
