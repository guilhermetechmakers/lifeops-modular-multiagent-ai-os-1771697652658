import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Shield, CreditCard, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { useOrganizationTeamSettings } from '@/hooks/use-organization-team-settings'
import { TeamRoster } from '@/components/organization-team-settings/TeamRoster'
import { RBACPolicies } from '@/components/organization-team-settings/RBACPolicies'
import { Billing } from '@/components/organization-team-settings/Billing'
import { Enterprise } from '@/components/organization-team-settings/Enterprise'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

export default function TeamSettings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading, isError, refetch } = useOrganizationTeamSettings()

  useEffect(() => {
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')
    if (success === 'true') {
      toast.success('Billing updated successfully')
      setSearchParams({}, { replace: true })
    } else if (canceled === 'true') {
      toast.info('Checkout was canceled')
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Organization & Team Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage team seats, roles, RBAC policies, billing and enterprise configuration
          </p>
        </div>
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-lg font-semibold mb-2">Failed to load settings</h2>
          <p className="text-sm text-muted-foreground mb-4">
            There was a problem loading your organization settings. Please try again.
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization & Team Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage team seats, roles, RBAC policies, billing and enterprise configuration
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : (
        <Tabs defaultValue="team" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 p-1 h-auto">
            <TabsTrigger value="team" className="flex items-center gap-2 py-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Team Roster</span>
            </TabsTrigger>
            <TabsTrigger value="rbac" className="flex items-center gap-2 py-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">RBAC</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2 py-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="enterprise" className="flex items-center gap-2 py-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Enterprise</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="team" className="mt-6 animate-fade-in">
            <TeamRoster
              data={data?.team_roster ?? { members: [], totalSeats: 5, usedSeats: 0, roles: [] }}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="rbac" className="mt-6 animate-fade-in">
            <RBACPolicies
              data={data?.rbac_policies ?? { roles: [], agentPermissions: {}, cronjobPermissions: {} }}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="billing" className="mt-6 animate-fade-in">
            <Billing
              data={
                data?.billing ?? {
                  plan: 'Pro',
                  planId: 'pro',
                  status: 'active',
                  invoices: [],
                  paymentMethods: [],
                  usageSummary: { agents: 0, cronjobs: 0, apiCalls: 0, storageGb: 0 },
                }
              }
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="enterprise" className="mt-6 animate-fade-in">
            <Enterprise
              data={
                data?.enterprise ?? {
                  samlEnabled: false,
                  provisioningEnabled: false,
                  onPremAgentRunnerEnabled: false,
                  dataResidency: 'us',
                }
              }
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
