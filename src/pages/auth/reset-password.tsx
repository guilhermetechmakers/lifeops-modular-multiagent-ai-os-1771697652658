import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/auth-layout'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { PasswordStrengthMeter } from '@/components/login-signup/PasswordStrengthMeter'
import { KeyRound, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export function ResetPassword() {
  const navigate = useNavigate()
  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const password = watch('password')

  useEffect(() => {
    if (!supabase) {
      setHasValidSession(true)
      return
    }
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const type = hashParams.get('type')

    if (type === 'recovery' && accessToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: hashParams.get('refresh_token') || '',
      }).then(() => {
        setHasValidSession(true)
        window.history.replaceState(null, '', window.location.pathname)
      }).catch(() => {
        toast.error('Invalid or expired reset link. Please request a new one.')
        setHasValidSession(false)
      })
    } else {
      toast.error('Invalid or expired reset link. Please request a new one.')
      setHasValidSession(false)
    }
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      if (!supabase) {
        await new Promise((r) => setTimeout(r, 500))
        toast.success('Password updated successfully')
        navigate('/login')
        return
      }

      const { error } = await supabase.auth.updateUser({ password: data.password })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Password updated successfully')
      navigate('/login')
    } catch {
      toast.error('Failed to update password. Please try again.')
    }
  }

  if (hasValidSession === null) {
    return <AuthLayout pageTitle="Set new password" isLoading><div /></AuthLayout>
  }

  if (hasValidSession === false) {
    return (
      <AuthLayout pageTitle="Invalid or expired link">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader className="text-center">
            <h2 className="text-xl font-semibold leading-none tracking-tight">Invalid or expired link</h2>
            <CardDescription>
              This password reset link is invalid or has expired. Please request a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/forgot-password">
              <Button className="w-full">Request new reset link</Button>
            </Link>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout pageTitle="Set new password">
      <Card className="w-full max-w-md shadow-card transition-all duration-300">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" aria-hidden />
          </div>
          <h2 className="text-xl font-semibold leading-none tracking-tight">Set new password</h2>
          <CardDescription>
            Enter your new password below. Use at least 8 characters with uppercase, lowercase, and numbers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-label="New password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                {...register('password')}
                className={cn(errors.password && 'border-destructive focus-visible:ring-destructive')}
              />
              <PasswordStrengthMeter password={password} />
              {errors.password && (
                <p id="password-error" role="alert" className="text-sm text-destructive">
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
                aria-label="Confirm new password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                {...register('confirmPassword')}
                className={cn(errors.confirmPassword && 'border-destructive focus-visible:ring-destructive')}
              />
              {errors.confirmPassword && (
                <p id="confirm-password-error" role="alert" className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Updating...
                </>
              ) : (
                'Update password'
              )}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link
              to="/login"
              className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            >
              Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
