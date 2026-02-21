import { useNavigate } from 'react-router-dom'
import { Wallet, CreditCard, Repeat, TrendingUp, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface FinanceOverview {
  totalAccounts: number
  totalTransactions: number
  activeSubscriptions: number
  forecastTrend: number
}

interface FinanceOverviewCardsProps {
  data?: FinanceOverview
  isLoading?: boolean
}

const cards: Array<{
  key: keyof FinanceOverview
  title: string
  description: string
  icon: typeof Wallet
  gradient: string
  href: string
}> = [
  { key: 'totalAccounts', title: 'Accounts', description: 'Connected', icon: Wallet, gradient: 'from-primary/20 to-primary/5', href: '/dashboard/connectors' },
  { key: 'totalTransactions', title: 'Transactions', description: 'This period', icon: CreditCard, gradient: 'from-accent/20 to-accent/5', href: '/dashboard/finance' },
  { key: 'activeSubscriptions', title: 'Subscriptions', description: 'Active', icon: Repeat, gradient: 'from-amber-500/20 to-amber-500/5', href: '/dashboard/finance' },
  { key: 'forecastTrend', title: 'Forecast', description: 'Trend vs plan', icon: TrendingUp, gradient: 'from-success/20 to-success/5', href: '/dashboard/finance' },
]

export function FinanceOverviewCards({ data, isLoading }: FinanceOverviewCardsProps) {
  const navigate = useNavigate()
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, title, description, icon: Icon, gradient, href }, i) => {
        const value = data?.[key] ?? 0
        const displayValue = key === 'forecastTrend' ? `${value >= 0 ? '+' : ''}${value}%` : value
        return (
          <Card
            key={key}
            role="button"
            tabIndex={0}
            onClick={() => navigate(href)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(href)}
            className={cn(
              'relative overflow-hidden border-border/50 transition-all duration-300 cursor-pointer',
              'hover:shadow-card-hover hover:scale-[1.02] hover:-translate-y-0.5 hover:border-primary/30',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'animate-fade-in'
            )}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none', gradient)} aria-hidden />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <div className="flex items-center gap-1">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className={cn(
                'text-2xl font-bold',
                key === 'forecastTrend' && value >= 0 ? 'text-success' : key === 'forecastTrend' && value < 0 ? 'text-destructive' : 'text-foreground'
              )}>
                {displayValue}
              </div>
              <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
