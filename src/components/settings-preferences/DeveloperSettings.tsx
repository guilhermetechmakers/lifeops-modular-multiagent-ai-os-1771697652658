import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Webhook, Key, FlaskConical, Plus, Trash2, Copy } from 'lucide-react'
import { toast } from 'sonner'
import type {
  DeveloperSettings as DeveloperSettingsType,
  WebhookEndpoint,
  SdkToken,
} from '@/types/settings-preferences'
import { useUpdateDeveloperSettings } from '@/hooks/use-settings-preferences'

interface DeveloperSettingsProps {
  settings: DeveloperSettingsType
  isLoading?: boolean
}

export function DeveloperSettings({ settings, isLoading }: DeveloperSettingsProps) {
  const updateMutation = useUpdateDeveloperSettings()
  const [localSettings, setLocalSettings] = useState<DeveloperSettingsType>(settings ?? {
    webhookEndpoints: [],
    sdkTokens: [],
    sandboxMode: false,
  })

  const handleSandboxToggle = (enabled: boolean) => {
    const next = { ...localSettings, sandboxMode: enabled }
    setLocalSettings(next)
    updateMutation.mutate(next)
  }

  const handleAddWebhook = () => {
    const newEndpoint: WebhookEndpoint = {
      id: crypto.randomUUID(),
      url: '',
      enabled: true,
      events: ['cronjob_completed', 'cronjob_failed'],
    }
    const endpoints = [...(localSettings.webhookEndpoints ?? []), newEndpoint]
    const next = { ...localSettings, webhookEndpoints: endpoints }
    setLocalSettings(next)
    updateMutation.mutate(next)
  }

  const handleRemoveWebhook = (id: string) => {
    const endpoints = (localSettings.webhookEndpoints ?? []).filter((e) => e.id !== id)
    const next = { ...localSettings, webhookEndpoints: endpoints }
    setLocalSettings(next)
    updateMutation.mutate(next)
  }

  const handleWebhookUpdate = (id: string, updates: Partial<WebhookEndpoint>) => {
    const endpoints = (localSettings.webhookEndpoints ?? []).map((e) =>
      e.id === id ? { ...e, ...updates } : e
    )
    const next = { ...localSettings, webhookEndpoints: endpoints }
    setLocalSettings(next)
    updateMutation.mutate(next)
  }

  const handleCreateSdkToken = () => {
    const newToken: SdkToken = {
      id: crypto.randomUUID(),
      name: `Token ${(localSettings.sdkTokens?.length ?? 0) + 1}`,
      prefix: 'lops_****',
      createdAt: new Date().toISOString(),
    }
    const tokens = [...(localSettings.sdkTokens ?? []), newToken]
    const next = { ...localSettings, sdkTokens: tokens }
    setLocalSettings(next)
    updateMutation.mutate(next)
    toast.success('SDK token created. Copy it now—it won\'t be shown again.')
  }

  const handleRemoveSdkToken = (id: string) => {
    const tokens = (localSettings.sdkTokens ?? []).filter((t) => t.id !== id)
    const next = { ...localSettings, sdkTokens: tokens }
    setLocalSettings(next)
    updateMutation.mutate(next)
  }

  const handleCopyToken = (prefix: string) => {
    navigator.clipboard.writeText(prefix)
    toast.success('Token prefix copied')
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-32 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FlaskConical className="h-5 w-5 text-primary" />
          Developer Settings
        </CardTitle>
        <CardDescription>
          Webhook endpoints, SDK tokens, sandbox mode toggle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-secondary/30">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label className="text-base font-medium">Sandbox mode</Label>
              <p className="text-sm text-muted-foreground">
                Use sandbox environment for testing
              </p>
            </div>
          </div>
          <Switch
            checked={localSettings.sandboxMode}
            onCheckedChange={handleSandboxToggle}
            disabled={updateMutation.isPending}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Webhook className="h-4 w-4" />
              Webhook endpoints
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddWebhook}
              disabled={updateMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add endpoint
            </Button>
          </div>
          {(localSettings.webhookEndpoints ?? []).length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <Webhook className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No webhook endpoints</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add endpoints to receive event notifications
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleAddWebhook}
              >
                Add first endpoint
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {localSettings.webhookEndpoints!.map((endpoint) => (
                <div
                  key={endpoint.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-border p-3"
                >
                  <Input
                    placeholder="https://your-endpoint.com/webhook"
                    value={endpoint.url}
                    onChange={(e) => handleWebhookUpdate(endpoint.id, { url: e.target.value })}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={endpoint.enabled}
                      onCheckedChange={(c) => handleWebhookUpdate(endpoint.id, { enabled: c })}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveWebhook(endpoint.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Key className="h-4 w-4" />
              SDK tokens
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateSdkToken}
              disabled={updateMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create token
            </Button>
          </div>
          {(localSettings.sdkTokens ?? []).length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <Key className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No SDK tokens</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create tokens for API access
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleCreateSdkToken}
              >
                Create first token
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {localSettings.sdkTokens!.map((token) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{token.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{token.prefix}</p>
                    {token.lastUsedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Last used: {new Date(token.lastUsedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyToken(token.prefix)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveSdkToken(token.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
