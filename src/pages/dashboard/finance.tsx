import { Wallet, TrendingUp, CreditCard, FileSpreadsheet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const forecastData = [
  { month: 'Jan', actual: 4200, forecast: 4000 },
  { month: 'Feb', actual: 3800, forecast: 4100 },
  { month: 'Mar', actual: 4500, forecast: 4200 },
  { month: 'Apr', actual: 4100, forecast: 4300 },
]

export function FinanceDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Finance</h1>
        <p className="text-muted-foreground mt-1">
          Automate bookkeeping, forecasting, anomalies
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Accounts</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Forecast</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+12%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Forecasting & Close</CardTitle>
          <CardDescription>
            Transactions feed with agent suggestions, export & audit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
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
                <XAxis dataKey="month" stroke="rgb(var(--muted-foreground))" />
                <YAxis stroke="rgb(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--card))',
                    border: '1px solid rgb(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area type="monotone" dataKey="actual" stroke="rgb(var(--primary))" fill="url(#colorActual)" />
                <Area type="monotone" dataKey="forecast" stroke="rgb(var(--accent))" fill="url(#colorForecast)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
