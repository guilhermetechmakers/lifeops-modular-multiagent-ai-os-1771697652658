import { useNavigate } from 'react-router-dom'
import { Wallet, Building2, CreditCard, PiggyBank, ChevronRight, Link2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { FinanceAccount } from '@/types/finance-dashboard'
import { cn } from '@/lib/utils'

const typeIcons = {
  checking: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
  investment: Building2,
}

const typeGradients: Record<string, string> = {
  checking: 'from-primary/20 to-primary/5',
  savings: 'from-success/20 to-success/5',
  credit: 'from-accent/20 to-accent/5',
  investment: 'from-warning/20 to-warning/5',
}

interface AccountsOverviewProps {
  accounts?: FinanceAccount[]
  isLoading?: boolean
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function AccountsOverview({ accounts = [], isLoading }: AccountsOverviewProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-28 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <Card className="overflow-hidden border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Link2 className="h-10 w-10 text-muted-foreground" aria-hidden />
          </div>
          <h3 className="font-semibold text-lg">No accounts connected</h3>
          <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
            Connect your bank accounts via Plaid or TrueLayer to see your financial overview.
          </p>
          <Button
            variant="default"
            className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 hover:scale-[1.02]"
            onClick={() => navigate('/dashboard/connectors')}
          >
            Connect Account
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account, i) => {
        const Icon = typeIcons[account.type] ?? Wallet
        const gradient = typeGradients[account.type] ?? typeGradients.checking
        return (
          <Card
            key={account.id}
            role="button"
            tabIndex={0}
            onClick={() => navigate('/dashboard/connectors')}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/connectors')}
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
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {account.isConnected && (
                  <Badge variant="secondary" className="text-xs bg-success/20 text-success">
                    Connected
                  </Badge>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className={cn(
                'text-2xl font-bold',
                account.balance < 0 ? 'text-destructive' : 'text-foreground'
              )}>
                {formatCurrency(account.balance, account.currency)}
              </div>
              <p className="text-xs text-muted-foreground">{account.institution}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
