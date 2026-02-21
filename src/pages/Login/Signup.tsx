import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LifeOpsLogo } from '@/components/design-system'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { LoginForm, type LoginFormData } from '@/components/login-signup/LoginForm'
import { SignupForm, type SignupFormData } from '@/components/login-signup/SignupForm'
import { SSOButtons } from '@/components/login-signup/SSOButtons'
import { OAuthConsentNote } from '@/components/login-signup/OAuthConsentNote'
import { SwitchFormAction } from '@/components/login-signup/SwitchFormAction'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type FormMode = 'login' | 'signup'

export default function LoginSignupPage() {
  const [mode, setMode] = useState<FormMode>('login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (_data: LoginFormData) => {
    setIsSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      toast.success('Signed in successfully')
      navigate('/dashboard')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignup = async (_data: SignupFormData) => {
    setIsSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      toast.success('Account created. Check your email to verify.')
      navigate('/verify-email')
    } catch {
      toast.error('Signup failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSSO = () => {
    toast.info('SSO coming soon')
  }

  return (
    <AuthLayout pageTitle={mode === 'login' ? 'Sign in' : 'Create an account'}>
      <Card className="w-full max-w-md shadow-card hover:shadow-card-hover transition-shadow duration-300">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <LifeOpsLogo size="lg" variant="gradient" asLink />
          </div>
          <h2 className="text-xl font-semibold leading-none tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>
          <CardDescription>
            {mode === 'login'
              ? 'Sign in to your account to continue'
              : 'Get started with LifeOps'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              mode === 'login' ? 'animate-fade-in' : 'animate-fade-in'
            )}
          >
            {mode === 'login' ? (
              <LoginForm onSubmit={handleLogin} isSubmitting={isSubmitting} />
            ) : (
              <SignupForm onSubmit={handleSignup} isSubmitting={isSubmitting} />
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <SSOButtons
            onGoogle={handleSSO}
            onMicrosoft={handleSSO}
            onGitHub={handleSSO}
            showSAML
            onSAML={handleSSO}
            disabled={isSubmitting}
          />

          <OAuthConsentNote />

          <SwitchFormAction mode={mode} onSwitch={setMode} />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
