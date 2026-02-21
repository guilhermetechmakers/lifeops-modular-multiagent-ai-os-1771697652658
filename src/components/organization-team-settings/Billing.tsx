import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, FileText, Download, Plus, TrendingUp } from 'lucide-react'
import type { BillingData } from '@/types/organization-team-settings'
import { useUpdateBilling } from '@/hooks/use-organization-team-settings'

interface BillingProps {
  data: BillingData
  isLoading?: boolean
}

export function Billing({ data, isLoading }: BillingProps) {
  const updateMutation = useUpdateBilling()

  const plan = data?.plan ?? 'Pro'
  const status = data?.status ?? 'active'
  const invoices = data?.invoices ?? []
  const paymentMethods = data?.paymentMethods ?? []
  const usage = data?.usageSummary ?? {
    agents: 0,
    cronjobs: 0,
    apiCalls: 0,
    storageGb: 0,
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <CreditCard className="h-5 w-5 text-primary" />
          Billing
        </CardTitle>
        <CardDescription>
          Plan details, invoices, payment methods, and usage summary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-4 transition-all duration-200 hover:shadow-md">
            <p className="text-sm text-muted-foreground mb-1">Current plan</p>
            <p className="text-2xl font-bold">{plan}</p>
            <Badge
              variant={status === 'active' ? 'default' : 'secondary'}
              className="mt-2 capitalize"
            >
              {status}
            </Badge>
          </div>
          <div className="rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-md">
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Agents
            </p>
            <p className="text-2xl font-bold">{usage.agents}</p>
          </div>
          <div className="rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-md">
            <p className="text-sm text-muted-foreground mb-1">Cronjobs</p>
            <p className="text-2xl font-bold">{usage.cronjobs}</p>
          </div>
          <div className="rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-md">
            <p className="text-sm text-muted-foreground mb-1">API calls</p>
            <p className="text-2xl font-bold">{usage.apiCalls.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment methods
            </h3>
            <Button variant="outline" size="sm" disabled={updateMutation.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          {paymentMethods.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <CreditCard className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No payment methods</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add a payment method to manage billing
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                Add payment method
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium capitalize">
                        {pm.brand ?? pm.type} •••• {pm.last4}
                      </p>
                      {pm.expiryMonth && pm.expiryYear && (
                        <p className="text-sm text-muted-foreground">
                          Expires {pm.expiryMonth}/{pm.expiryYear}
                        </p>
                      )}
                    </div>
                  </div>
                  {pm.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Invoices
          </h3>
          {invoices.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No invoices yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Invoices will appear here when your plan renews
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="divide-y divide-border">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
                  >
                    <div>
                      <p className="font-medium">
                        {new Date(inv.date).toLocaleDateString()} — {inv.currency}{' '}
                        {inv.amount.toFixed(2)}
                      </p>
                      <Badge
                        variant={
                          inv.status === 'paid'
                            ? 'default'
                            : inv.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                        className="mt-1 capitalize"
                      >
                        {inv.status}
                      </Badge>
                    </div>
                    {inv.downloadUrl && (
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
