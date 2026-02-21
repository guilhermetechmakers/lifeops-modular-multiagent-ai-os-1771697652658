import { Plus, Clock, AlertCircle, FileCheck, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const overviewData = [
  { name: 'Mon', runs: 12, success: 10 },
  { name: 'Tue', runs: 19, success: 17 },
  { name: 'Wed', runs: 15, success: 14 },
  { name: 'Thu', runs: 22, success: 20 },
  { name: 'Fri', runs: 18, success: 16 },
  { name: 'Sat', runs: 8, success: 8 },
  { name: 'Sun', runs: 5, success: 5 },
]

const activeRuns = [
  { id: '1', name: 'PR Triage', status: 'running', progress: 65 },
  { id: '2', name: 'Weekly Digest', status: 'running', progress: 30 },
]

const alerts = [
  { id: '1', message: 'Cronjob "Monthly Close" failed', severity: 'high' },
  { id: '2', message: 'Connector GitHub token expiring', severity: 'medium' },
]

export function MasterDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Master Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          System health and orchestration overview
        </p>
      </div>

      {/* System Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Runs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Running now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cronjobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">2</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Runs Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Run Activity</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overviewData}>
                  <defs>
                    <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis dataKey="name" stroke="rgb(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="rgb(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(var(--card))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="runs"
                    stroke="rgb(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorRuns)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Active Runs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Runs</CardTitle>
              <CardDescription>Currently executing</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Quick Create
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRuns.map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium">{run.name}</p>
                    <Badge variant="secondary" className="mt-1">
                      {run.progress}%
                    </Badge>
                  </div>
                  <div className="w-24">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${run.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>Items requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
              >
                <p className="text-sm">{a.message}</p>
                <Badge variant={a.severity === 'high' ? 'destructive' : 'secondary'}>
                  {a.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
