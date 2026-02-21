import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Building2,
  Server,
  Globe,
  Shield,
  Users,
  Database,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EnterpriseData } from '@/types/organization-team-settings'
import { useUpdateEnterprise } from '@/hooks/use-organization-team-settings'

interface EnterpriseProps {
  data: EnterpriseData
  isLoading?: boolean
}

const DATA_RESIDENCY_OPTIONS = [
  { id: 'us', label: 'United States', description: 'US data centers' },
  { id: 'eu', label: 'European Union', description: 'EU data centers (GDPR)' },
  { id: 'custom', label: 'Custom', description: 'On-premise or custom region' },
] as const

export function Enterprise({ data, isLoading }: EnterpriseProps) {
  const updateMutation = useUpdateEnterprise()
  const [localData, setLocalData] = useState<EnterpriseData>(data ?? {
    samlEnabled: false,
    provisioningEnabled: false,
    onPremAgentRunnerEnabled: false,
    dataResidency: 'us',
  })

  const handleToggle = (key: keyof EnterpriseData, value: boolean) => {
    const next = { ...localData, [key]: value }
    setLocalData(next)
    updateMutation.mutate(next)
  }

  const handleResidencyChange = (residency: 'us' | 'eu' | 'custom') => {
    const next = { ...localData, dataResidency: residency }
    setLocalData(next)
    updateMutation.mutate(next)
  }

  const handleFieldChange = (key: keyof EnterpriseData, value: string) => {
    const next = { ...localData, [key]: value }
    setLocalData(next)
    updateMutation.mutate(next)
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Building2 className="h-5 w-5 text-primary" />
          Enterprise
        </CardTitle>
        <CardDescription>
          SAML SSO, provisioning, on-prem agent runner settings, and data residency options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-base font-medium">SAML SSO</Label>
                <p className="text-sm text-muted-foreground">
                  Enable single sign-on with your identity provider
                </p>
              </div>
            </div>
            <Switch
              checked={localData.samlEnabled}
              onCheckedChange={(v) => handleToggle('samlEnabled', v)}
              disabled={updateMutation.isPending}
            />
          </div>
          {localData.samlEnabled && (
            <div className="grid gap-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label>Entity ID</Label>
                <Input
                  placeholder="https://your-org.lifeops.io/saml"
                  value={localData.samlEntityId ?? ''}
                  onChange={(e) => handleFieldChange('samlEntityId', e.target.value)}
                  onBlur={() => updateMutation.mutate(localData)}
                />
              </div>
              <div className="space-y-2">
                <Label>SSO URL</Label>
                <Input
                  placeholder="https://idp.example.com/sso"
                  value={localData.samlSsoUrl ?? ''}
                  onChange={(e) => handleFieldChange('samlSsoUrl', e.target.value)}
                  onBlur={() => updateMutation.mutate(localData)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-base font-medium">SCIM provisioning</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically provision users and groups
                </p>
              </div>
            </div>
            <Switch
              checked={localData.provisioningEnabled}
              onCheckedChange={(v) => handleToggle('provisioningEnabled', v)}
              disabled={updateMutation.isPending}
            />
          </div>
          {localData.provisioningEnabled && (
            <div className="pt-4 border-t border-border space-y-2">
              <Label>SCIM endpoint</Label>
              <Input
                placeholder="https://api.lifeops.io/scim/v2"
                value={localData.scimEndpoint ?? ''}
                onChange={(e) => handleFieldChange('scimEndpoint', e.target.value)}
                onBlur={() => updateMutation.mutate(localData)}
              />
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-base font-medium">On-prem agent runner</Label>
                <p className="text-sm text-muted-foreground">
                  Run agents on your own infrastructure
                </p>
              </div>
            </div>
            <Switch
              checked={localData.onPremAgentRunnerEnabled}
              onCheckedChange={(v) => handleToggle('onPremAgentRunnerEnabled', v)}
              disabled={updateMutation.isPending}
            />
          </div>
          {localData.onPremAgentRunnerEnabled && (
            <div className="pt-4 border-t border-border space-y-2">
              <Label>Runner URL</Label>
              <Input
                placeholder="https://runner.your-company.com"
                value={localData.onPremRunnerUrl ?? ''}
                onChange={(e) => handleFieldChange('onPremRunnerUrl', e.target.value)}
                onBlur={() => updateMutation.mutate(localData)}
              />
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-lg border border-border p-4">
          <h3 className="font-medium flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            Data residency
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose where your data is stored and processed
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {DATA_RESIDENCY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleResidencyChange(opt.id)}
                disabled={updateMutation.isPending}
                className={cn(
                  'rounded-lg border p-4 text-left transition-all duration-200',
                  localData.dataResidency === opt.id
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-border hover:bg-secondary/30'
                )}
              >
                <Database className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="font-medium">{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
              </button>
            ))}
          </div>
          {localData.dataResidency === 'custom' && (
            <div className="pt-4 border-t border-border space-y-2">
              <Label>Custom region</Label>
              <Input
                placeholder="e.g. ap-southeast-1"
                value={localData.dataResidencyRegion ?? ''}
                onChange={(e) => handleFieldChange('dataResidencyRegion', e.target.value)}
                onBlur={() => updateMutation.mutate(localData)}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
