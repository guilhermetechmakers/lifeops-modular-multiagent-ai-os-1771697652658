import { useNavigate } from 'react-router-dom'
import { TrendingUp, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { FinanceForecast } from '@/types/finance-dashboard'
import { cn } from '@/lib/utils'

interface ForecastingMonthlyCloseProps {
  forecast?: FinanceForecast[]
  isLoading?: boolean
}

export function ForecastingMonthlyClose({ forecast = [], isLoading }: ForecastingMonthlyCloseProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <div className="flex gap-4 mt-6">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (forecast.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Forecasting & Monthly Close</CardTitle>
          <p className="text-sm text-muted-foreground">
            Cash flow forecasts and reconciliation workspace
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <TrendingUp className="h-10 w-10 text-muted-foreground" aria-hidden />
            </div>
            <h3 className="font-semibold text-lg">No forecast data</h3>
            <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
              Connect accounts and add transactions to generate cash flow forecasts and run monthly close.
            </p>
            <Button
              variant="outline"
              className="mt-4 transition-all duration-200 hover:scale-[1.02]"
              onClick={() => navigate('/dashboard/connectors')}
            >
              Connect Accounts
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const latestVariance = forecast[forecast.length - 1]?.variance ?? 0
  const isPositive = latestVariance >= 0

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => {}}
      onKeyDown={(e) => e.key === 'Enter' && {}}
      className={cn(
        'overflow-hidden transition-all duration-300 cursor-pointer',
        'hover:shadow-card-hover hover:border-primary/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Forecasting & Monthly Close
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Actual vs forecast with variance tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-sm font-semibold',
            isPositive ? 'text-success' : 'text-destructive'
          )}>
            {isPositive ? '+' : ''}{latestVariance}% variance
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(var(--accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="rgb(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
              <XAxis dataKey="month" stroke="rgb(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="rgb(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(var(--card))',
                  border: '1px solid rgb(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="rgb(var(--primary))" fill="url(#colorActual)" strokeWidth={2} />
              <Area type="monotone" dataKey="forecast" name="Forecast" stroke="rgb(var(--accent))" fill="url(#colorForecast)" strokeWidth={2} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-primary" />
            Actual
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-accent" />
            Forecast
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
