import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { subscribeNewsletter } from '@/api/newsletter'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

type FormData = z.infer<typeof schema>

export function NewsletterSignup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await subscribeNewsletter(data.email)
      toast.success('Thanks for subscribing! Check your inbox for updates.')
      reset()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Subscription failed. Please try again.'
      toast.error(message)
      throw err
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3"
      noValidate
      aria-label="Newsletter signup form"
    >
      <div className="space-y-2">
        <Label
          htmlFor="newsletter-email"
          className="text-sm font-medium text-foreground"
        >
          Stay updated
        </Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
              aria-hidden
            />
            <Input
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'newsletter-email-error' : undefined}
              className={cn(
                'pl-9 h-10',
                errors.email && 'border-destructive focus-visible:ring-destructive'
              )}
              {...register('email')}
            />
          </div>
          <Button
            type="submit"
            size="default"
            disabled={isSubmitting}
            className="h-10 px-6 shrink-0"
            aria-label={isSubmitting ? 'Subscribing...' : 'Subscribe to newsletter'}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                <span>Subscribing...</span>
              </>
            ) : (
              'Subscribe'
            )}
          </Button>
        </div>
        {errors.email && (
          <p
            id="newsletter-email-error"
            className="flex items-center gap-1.5 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
            {errors.email.message}
          </p>
        )}
      </div>
    </form>
  )
}
