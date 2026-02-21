import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <Card className="w-full max-w-md shadow-card hover:shadow-card-hover transition-shadow duration-300">
        <CardHeader className="text-center space-y-2">
          <Link
            to="/"
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block hover:opacity-90 transition-opacity"
          >
            LifeOps
          </Link>
          <CardTitle className="text-xl">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </CardTitle>
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
    </div>
  )
}
