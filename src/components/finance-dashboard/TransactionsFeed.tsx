import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDownLeft, ArrowUpRight, AlertTriangle, Filter, SearchX } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EmptyStateIllustration } from '@/components/design-system/illustrations/EmptyStateIllustration'
import type { FinanceTransaction } from '@/types/finance-dashboard'
import { cn } from '@/lib/utils'

interface TransactionsFeedProps {
  transactions?: FinanceTransaction[]
  isLoading?: boolean
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    signDisplay: 'auto',
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const CATEGORY_FILTER = ['All', 'Food & Drink', 'Software', 'Transfer', 'Income', 'Entertainment']

export function TransactionsFeed({ transactions = [], isLoading }: TransactionsFeedProps) {
  const navigate = useNavigate()
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showAnomaliesOnly, setShowAnomaliesOnly] = useState(false)

  const filtered = transactions.filter((t) => {
    const matchCategory = categoryFilter === 'All' || t.category === categoryFilter
    const matchAnomaly = !showAnomaliesOnly || t.isAnomaly
    return matchCategory && matchAnomaly
  })

  const hasActiveFilters = categoryFilter !== 'All' || showAnomaliesOnly

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Transactions Feed</CardTitle>
          <p className="text-sm text-muted-foreground">
            Categorized transactions with anomaly detection
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 md:py-16">
            <EmptyStateIllustration variant="finance" size="lg" className="mb-4" />
            <h3 className="font-semibold text-lg text-foreground">No transactions yet</h3>
            <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
              Connect your accounts to see and categorize transactions. Anomalies will be flagged automatically.
            </p>
            <Button
              variant="default"
              className="mt-6 transition-all duration-200 hover:scale-[1.02]"
              onClick={() => navigate('/dashboard/connectors')}
            >
              Connect Account
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (filtered.length === 0 && hasActiveFilters) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Transactions Feed</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Categorized transactions with anomaly detection
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_FILTER.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showAnomaliesOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowAnomaliesOnly(!showAnomaliesOnly)}
              className="gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Anomalies only
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 md:py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <SearchX className="h-10 w-10 text-muted-foreground" aria-hidden />
            </div>
            <h3 className="font-semibold text-lg text-foreground">No transactions match your filters</h3>
            <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
              Try adjusting the category filter or turn off &quot;Anomalies only&quot; to see more results.
            </p>
            <Button
              variant="outline"
              className="mt-6 transition-all duration-200 hover:scale-[1.02]"
              onClick={() => {
                setCategoryFilter('All')
                setShowAnomaliesOnly(false)
              }}
            >
              Clear filters
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const anomalyCount = transactions.filter((t) => t.isAnomaly).length

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            Transactions Feed
            {anomalyCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {anomalyCount} anomaly{anomalyCount !== 1 ? 'ies' : ''}
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Categorized transactions with anomaly detection
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_FILTER.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {anomalyCount > 0 && (
            <Button
              variant={showAnomaliesOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowAnomaliesOnly(!showAnomaliesOnly)}
              className="gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Anomalies only
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-0 max-h-[400px] overflow-y-auto">
          {filtered.map((tx) => (
            <div
              key={tx.id}
              className={cn(
                'flex items-center justify-between py-4 px-3 rounded-lg transition-all duration-200',
                'hover:bg-muted/50 border-b border-border last:border-0',
                tx.isAnomaly && 'bg-destructive/5 border-l-2 border-l-destructive'
              )}
            >
              <div className="flex gap-3 min-w-0">
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  tx.amount >= 0 ? 'bg-success/20' : 'bg-muted'
                )}>
                  {tx.amount >= 0 ? (
                    <ArrowDownLeft className="h-5 w-5 text-success" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{tx.description}</p>
                    {tx.isAnomaly && (
                      <span title={tx.anomalyReason} aria-label={tx.anomalyReason}>
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(tx.date)}
                    {tx.category && ` • ${tx.category}`}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={cn(
                  'font-semibold',
                  tx.amount >= 0 ? 'text-success' : 'text-foreground'
                )}>
                  {formatCurrency(tx.amount, tx.currency)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
