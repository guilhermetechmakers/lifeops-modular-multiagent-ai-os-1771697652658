import { Link } from 'react-router-dom'
import { LifeOpsLogo } from '@/components/design-system'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
})

type FormData = z.infer<typeof schema>

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const hasErrors = Object.keys(errors).length > 0

  const onSubmit = async (_data: FormData) => {
    try {
      // TODO: API call
      await new Promise((r) => setTimeout(r, 500))
      toast.success('Signed in successfully')
      window.location.href = '/dashboard'
    } catch {
      toast.error('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      {/* Animated gradient mesh background - design tokens only */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-glow-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

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
          <h1 className="text-xl font-semibold leading-none tracking-tight text-card-foreground">
            Welcome back
          </h1>
          <CardDescription>Sign in to your account</CardDescription>
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
                autoComplete="current-password"
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
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button type="button" variant="outline" disabled>
                Google
              </Button>
              <Button type="button" variant="outline" disabled>
                GitHub
              </Button>
              <Button type="button" variant="outline" disabled>
                Microsoft
              </Button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
