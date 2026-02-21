import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  FileText,
  Download,
  Plus,
  TrendingUp,
  Bot,
  Clock,
  Zap,
  HardDrive,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import type { BillingData } from '@/types/organization-team-settings'
import {
  useUpdateBilling,
  useCreateBillingPortalSession,
  useCreateCheckoutSession,
} from '@/hooks/use-organization-team-settings'
import { EmptyState } from '@/components/ui/empty-state'

interface BillingProps {
  data: BillingData
  isLoading?: boolean
}

const USAGE_SPARKLINE_DATA = [
  { name: 'W1', agents: 2, cronjobs: 4, apiCalls: 1200 },
  { name: 'W2', agents: 3, cronjobs: 5, apiCalls: 1800 },
  { name: 'W3', agents: 4, cronjobs: 6, apiCalls: 2400 },
  { name: 'W4', agents: 5, cronjobs: 7, apiCalls: 3200 },
]

export function Billing({ data, isLoading }: BillingProps) {
  const updateMutation = useUpdateBilling()
  const portalMutation = useCreateBillingPortalSession()
  const checkoutMutation = useCreateCheckoutSession()

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
  const stripeCustomerId = data?.stripeCustomerId

  const handleManageBilling = () => {
    const returnUrl = `${window.location.origin}/dashboard/organization-team-settings`
    portalMutation.mutate({ returnUrl, customerId: stripeCustomerId })
  }

  const handleUpgradePlan = () => {
    const successUrl = `${window.location.origin}/dashboard/organization-team-settings?success=true`
    const cancelUrl = `${window.location.origin}/dashboard/organization-team-settings?canceled=true`
    checkoutMutation.mutate({ successUrl, cancelUrl })
  }

  const isPortalPending = portalMutation.isPending || checkoutMutation.isPending

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
          <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
            <p className="text-sm text-muted-foreground mb-1">Current plan</p>
            <p className="text-2xl font-bold">{plan}</p>
            <Badge
              variant={status === 'active' ? 'default' : 'secondary'}
              className="mt-2 capitalize"
            >
              {status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full transition-all duration-200 hover:scale-[1.02]"
              onClick={handleManageBilling}
              disabled={isPortalPending}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Manage subscription
            </Button>
          </div>
          <div className="rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <Bot className="h-4 w-4" />
              Agents
            </p>
            <p className="text-2xl font-bold">{usage.agents}</p>
          </div>
          <div className="rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Cronjobs
            </p>
            <p className="text-2xl font-bold">{usage.cronjobs}</p>
          </div>
          <div className="rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <Zap className="h-4 w-4" />
              API calls
            </p>
            <p className="text-2xl font-bold">{usage.apiCalls.toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border p-4">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4" />
            Usage overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-24">
              <p className="text-xs text-muted-foreground mb-1">Agents & Cronjobs</p>
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={USAGE_SPARKLINE_DATA}>
                  <defs>
                    <linearGradient id="agentsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="agents"
                    stroke="rgb(var(--primary))"
                    fill="url(#agentsGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="h-24">
              <p className="text-xs text-muted-foreground mb-1">API calls</p>
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={USAGE_SPARKLINE_DATA}>
                  <defs>
                    <linearGradient id="apiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="apiCalls"
                    stroke="rgb(var(--accent))"
                    fill="url(#apiGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border p-3">
              <HardDrive className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Storage</p>
                <p className="text-lg font-bold">{usage.storageGb} GB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment methods
            </h3>
            <Button
              variant="outline"
              size="sm"
              disabled={isPortalPending || updateMutation.isPending}
              onClick={handleManageBilling}
              className="transition-all duration-200 hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          {paymentMethods.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8">
              <EmptyState
                icon={CreditCard}
                heading="No payment methods"
                description="Add a payment method to manage billing and subscriptions. You can add cards or bank accounts via the billing portal."
                action={
                  <Button
                    onClick={handleManageBilling}
                    disabled={isPortalPending}
                    className="transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add payment method
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-all duration-200 hover:bg-secondary/30 hover:shadow-sm"
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
                  <div className="flex items-center gap-2">
                    {pm.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleManageBilling}
                      disabled={isPortalPending}
                    >
                      Manage
                    </Button>
                  </div>
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
            <div className="rounded-xl border border-dashed border-border p-8">
              <EmptyState
                icon={FileText}
                heading="No invoices yet"
                description="Invoices will appear here when your plan renews or when you make a purchase."
                action={
                  <Button
                    variant="outline"
                    onClick={handleUpgradePlan}
                    disabled={isPortalPending}
                    className="transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Upgrade plan
                  </Button>
                }
              />
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

        {plan === 'Free' && (
          <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5 p-6">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Upgrade to Pro
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get more agents, cronjobs, and API calls. Unlock enterprise features and priority support.
            </p>
            <Button
              onClick={handleUpgradePlan}
              disabled={isPortalPending}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200 hover:scale-[1.02]"
            >
              Upgrade to Pro — $29/mo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
