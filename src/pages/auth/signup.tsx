import { Link } from 'react-router-dom'
import { LifeOpsLogo } from '@/components/design-system'
import { AuthLayout } from '@/components/layout/auth-layout'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const schema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    acceptTos: z.boolean().refine((v) => v === true, 'You must accept the terms'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { acceptTos: false },
  })

  const acceptTos = watch('acceptTos')
  const hasErrors = Object.keys(errors).length > 0

  const onSubmit = async (_data: FormData) => {
    try {
      await new Promise((r) => setTimeout(r, 500))
      toast.success('Account created. Check your email to verify.')
      window.location.href = '/email-verification'
    } catch {
      toast.error('Signup failed')
    }
  }

  return (
    <AuthLayout>
      <Card
        className={cn(
          'w-full max-w-md shadow-card transition-all duration-300',
          hasErrors && 'animate-shake'
        )}
      >
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <LifeOpsLogo size="lg" variant="gradient" asLink />
          </div>
          <h1 className="text-xl font-semibold leading-none tracking-tight text-card-foreground sm:text-2xl">
            Create an account
          </h1>
          <CardDescription>Get started with LifeOps</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={cn(errors.email && 'border-destructive focus-visible:ring-destructive')}
                {...register('email')}
              />
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="flex items-center gap-1.5 text-sm text-destructive"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={cn(errors.password && 'border-destructive focus-visible:ring-destructive')}
                {...register('password')}
              />
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="flex items-center gap-1.5 text-sm text-destructive"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? 'confirmPassword-error' : undefined
                }
                className={cn(
                  errors.confirmPassword &&
                    'border-destructive focus-visible:ring-destructive'
                )}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p
                  id="confirmPassword-error"
                  role="alert"
                  className="flex items-center gap-1.5 text-sm text-destructive"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="tos"
                checked={acceptTos}
                onCheckedChange={(checked) => setValue('acceptTos', !!checked)}
                aria-invalid={!!errors.acceptTos}
                aria-describedby={errors.acceptTos ? 'tos-error' : undefined}
                className="mt-0.5 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              />
              <Label
                htmlFor="tos"
                className="text-sm font-normal text-muted-foreground cursor-pointer leading-tight"
              >
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {errors.acceptTos && (
              <p
                id="tos-error"
                role="alert"
                className="flex items-center gap-1.5 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                {errors.acceptTos.message}
              </p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Creating account...
                </>
              ) : (
                'Sign up'
              )}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
