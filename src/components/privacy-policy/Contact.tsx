import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Mail, MapPin, Clock, User } from 'lucide-react'
import type { DpoContact } from '@/types/privacy-policy'
import { cn } from '@/lib/utils'

export interface ContactProps {
  dpo: DpoContact
  isLoading?: boolean
  className?: string
}

/**
 * Data protection officer contact.
 */
export function Contact({ dpo, isLoading = false, className }: ContactProps) {
  if (isLoading) {
    return (
      <Card
        className={cn(
          'overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300',
          className
        )}
      >
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-success/5 to-primary/5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover hover:border-primary/20',
        className
      )}
    >
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-success/5 to-primary/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <User className="h-5 w-5 text-success" />
          Data Protection Officer
        </CardTitle>
        <CardDescription>
          Contact our DPO for privacy inquiries, data requests, or complaints
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">{dpo.name}</p>
          </div>
        </div>
        <a
          href={`mailto:${dpo.email}`}
          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg p-2 -m-2"
        >
          <Mail className="h-4 w-4 shrink-0" />
          <span>{dpo.email}</span>
        </a>
        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">{dpo.address}</p>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            Response time: {dpo.responseTime}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
