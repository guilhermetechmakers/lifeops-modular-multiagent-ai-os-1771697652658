import { Repeat, Calendar, ChevronRight, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyStateIllustration } from '@/components/design-system/illustrations/EmptyStateIllustration'
import type { FinanceSubscription } from '@/types/finance-dashboard'
import { cn } from '@/lib/utils'

interface SubscriptionsManagerProps {
  subscriptions?: FinanceSubscription[]
  isLoading?: boolean
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function SubscriptionsManager({ subscriptions = [], isLoading }: SubscriptionsManagerProps) {
  const activeSubs = subscriptions.filter((s) => s.status === 'active')
  const totalMonthly = activeSubs.reduce((sum, s) => {
    const amt = s.interval === 'yearly' ? s.amount / 12 : s.amount
    return sum + amt
  }, 0)

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Subscriptions Manager</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track recurring payments and billing cycles
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 md:py-16">
            <EmptyStateIllustration variant="finance" size="lg" className="mb-4" />
            <h3 className="font-semibold text-lg text-foreground">No subscriptions tracked</h3>
            <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
              Subscriptions from connected accounts will appear here. Add manual entries to track all recurring payments.
            </p>
            <Button
              variant="outline"
              className="mt-6 transition-all duration-200 hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Subscriptions Manager</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {activeSubs.length} active • {formatCurrency(totalMonthly, 'USD')}/mo total
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 transition-all duration-200 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-0 max-h-[320px] overflow-y-auto">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              role="button"
              tabIndex={0}
              onClick={() => {}}
              onKeyDown={(e) => e.key === 'Enter' && {}}
              className={cn(
                'flex items-center justify-between py-4 px-3 rounded-lg transition-all duration-200',
                'hover:bg-muted/50 border-b border-border last:border-0 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                  <Repeat className="h-5 w-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{sub.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Next: {formatDate(sub.nextBillingDate)}
                    </span>
                    {sub.category && (
                      <Badge variant="secondary" className="text-xs">
                        {sub.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-semibold">
                  {formatCurrency(sub.amount, sub.currency)}
                  <span className="text-xs font-normal text-muted-foreground">/{sub.interval === 'yearly' ? 'yr' : 'mo'}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
