import { useEffect } from 'react'
import { useFinanceDashboard } from '@/hooks/use-finance-dashboard'
import { FinanceOverviewCards } from '@/components/finance-dashboard/FinanceOverviewCards'
import { AccountsOverview } from '@/components/finance-dashboard/AccountsOverview'
import { TransactionsFeed } from '@/components/finance-dashboard/TransactionsFeed'
import { SubscriptionsManager } from '@/components/finance-dashboard/SubscriptionsManager'
import { ForecastingMonthlyClose } from '@/components/finance-dashboard/ForecastingMonthlyClose'
import { ExportAudit } from '@/components/finance-dashboard/ExportAudit'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FinanceDashboard() {
  const { data, isLoading, isError, refetch } = useFinanceDashboard()

  useEffect(() => {
    const prevTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    document.title = 'Module Dashboard — Finance | LifeOps'
    if (meta) {
      meta.setAttribute('content', 'Finance module: accounts overview, transactions feed with categorization and anomalies, subscriptions manager, forecasting and monthly close, export and audit')
    }
    return () => {
      document.title = prevTitle
      if (meta) meta.setAttribute('content', prevDesc)
    }
  }, [])

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Module Dashboard — Finance</h1>
          <p className="text-muted-foreground mt-1">
            Accounts, transactions, subscriptions, forecasting, and audit
          </p>
        </div>
        <div
          className={cn(
            'flex flex-col items-center justify-center py-16 rounded-2xl border border-destructive/30',
            'bg-destructive/5 transition-all duration-300 hover:border-destructive/40'
          )}
        >
          <AlertCircle className="h-12 w-12 text-destructive mb-4" aria-hidden />
          <h3 className="font-semibold text-lg">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Failed to load finance dashboard data.
          </p>
          <Button
            variant="outline"
            className="mt-4 transition-all duration-200 hover:scale-[1.02]"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-accent">
            Module Dashboard — Finance
          </span>
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          Accounts overview, transactions feed with categorization and anomalies, subscriptions manager, forecasting & monthly close, export & audit
        </p>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <FinanceOverviewCards data={data?.overview} isLoading={isLoading} />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
        <h2 className="text-lg font-semibold mb-4">Accounts Overview</h2>
        <AccountsOverview accounts={data?.accounts} isLoading={isLoading} />
      </div>

      <div
        className="grid gap-6 lg:grid-cols-2 animate-fade-in"
        style={{ animationDelay: '200ms' }}
      >
        <TransactionsFeed transactions={data?.transactions} isLoading={isLoading} />
        <SubscriptionsManager subscriptions={data?.subscriptions} isLoading={isLoading} />
      </div>

      <div
        className="grid gap-6 lg:grid-cols-2 animate-fade-in"
        style={{ animationDelay: '300ms' }}
      >
        <ForecastingMonthlyClose forecast={data?.forecast} isLoading={isLoading} />
        <ExportAudit auditSnapshot={data?.auditSnapshot} isLoading={isLoading} />
      </div>
    </div>
  )
}
