import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export function VerifyEmail() {
  const [code, setCode] = useState('')
  const [resending, setResending] = useState(false)

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.error('Enter a 6-digit code')
      return
    }
    toast.success('Email verified')
    window.location.href = '/dashboard'
  }

  const handleResend = async () => {
    setResending(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Verification email sent')
    setResending(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            We sent a 6-digit code to your email. Enter it below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="000000"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="text-center text-2xl tracking-[0.5em]"
          />
          <Button onClick={handleVerify} className="w-full">
            Verify
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email?{' '}
            <Button
              variant="link"
              className="p-0 h-auto text-primary"
              onClick={handleResend}
              disabled={resending}
            >
              Resend
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
