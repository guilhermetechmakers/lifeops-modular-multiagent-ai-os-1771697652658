import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Mail,
  Bell,
  Webhook,
  Plus,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NotificationRules as NotificationRulesType, EventFilter } from '@/types/settings-preferences'
import { useUpdateNotificationRules } from '@/hooks/use-settings-preferences'

const EVENT_OPTIONS = [
  { id: 'cronjob_completed', label: 'Cronjob completed' },
  { id: 'cronjob_failed', label: 'Cronjob failed' },
  { id: 'approval_required', label: 'Approval required' },
  { id: 'connector_expiring', label: 'Connector expiring' },
  { id: 'agent_error', label: 'Agent error' },
]

interface NotificationRulesProps {
  rules: NotificationRulesType
  isLoading?: boolean
}

export function NotificationRules({ rules, isLoading }: NotificationRulesProps) {
  const updateMutation = useUpdateNotificationRules()
  const [localRules, setLocalRules] = useState<NotificationRulesType>(rules)

  const handleToggle = (key: keyof NotificationRulesType, value: boolean) => {
    const next = { ...localRules, [key]: value }
    setLocalRules(next)
    updateMutation.mutate(next)
  }

  const handleWebhookUrlChange = (url: string) => {
    const next = { ...localRules, webhookUrl: url }
    setLocalRules(next)
  }

  const handleSaveWebhook = () => {
    updateMutation.mutate(localRules)
  }

  const handleAddEventFilter = () => {
    const newFilter: EventFilter = {
      id: crypto.randomUUID(),
      event: 'cronjob_completed',
      enabled: true,
      channels: ['email', 'inApp'],
    }
    const filters = [...(localRules.eventFilters ?? []), newFilter]
    const next = { ...localRules, eventFilters: filters }
    setLocalRules(next)
    updateMutation.mutate(next)
  }

  const handleRemoveEventFilter = (id: string) => {
    const filters = (localRules.eventFilters ?? []).filter((f) => f.id !== id)
    const next = { ...localRules, eventFilters: filters }
    setLocalRules(next)
    updateMutation.mutate(next)
  }

  const handleEventFilterChange = (id: string, updates: Partial<EventFilter>) => {
    const filters = (localRules.eventFilters ?? []).map((f) =>
      f.id === id ? { ...f, ...updates } : f
    )
    const next = { ...localRules, eventFilters: filters }
    setLocalRules(next)
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-5 w-9 animate-pulse rounded-full bg-muted" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Bell className="h-5 w-5 text-primary" />
          Notification Rules
        </CardTitle>
        <CardDescription>
          Email, in-app and webhook notifications with granular event filters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label className="text-base font-medium">Email notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email for approvals and alerts</p>
            </div>
          </div>
          <Switch
            checked={localRules.email}
            onCheckedChange={(v) => handleToggle('email', v)}
            disabled={updateMutation.isPending}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label className="text-base font-medium">In-app notifications</Label>
              <p className="text-sm text-muted-foreground">Show in-app toasts and notifications</p>
            </div>
          </div>
          <Switch
            checked={localRules.inApp}
            onCheckedChange={(v) => handleToggle('inApp', v)}
            disabled={updateMutation.isPending}
          />
        </div>

        <div className="space-y-4 rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Webhook className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-base font-medium">Webhook notifications</Label>
                <p className="text-sm text-muted-foreground">Send events to external endpoints</p>
              </div>
            </div>
            <Switch
              checked={localRules.webhook}
              onCheckedChange={(v) => handleToggle('webhook', v)}
              disabled={updateMutation.isPending}
            />
          </div>
          {localRules.webhook && (
            <div className="flex gap-2 pt-2">
              <Input
                placeholder="https://your-endpoint.com/webhook"
                value={localRules.webhookUrl ?? ''}
                onChange={(e) => handleWebhookUrlChange(e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleSaveWebhook}
                disabled={updateMutation.isPending}
              >
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Event filters</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddEventFilter}
              disabled={updateMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add filter
            </Button>
          </div>
          {(localRules.eventFilters ?? []).length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No event filters</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add filters to control which events trigger notifications
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleAddEventFilter}
              >
                Add first filter
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {localRules.eventFilters!.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/30"
                >
                  <Select
                    value={filter.event}
                    onChange={(v) => handleEventFilterChange(filter.id, { event: v })}
                    options={EVENT_OPTIONS}
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={filter.channels.includes('email')}
                        onCheckedChange={(c) =>
                          handleEventFilterChange(filter.id, {
                            channels: c
                              ? (filter.channels.includes('email') ? filter.channels : [...filter.channels, 'email'])
                              : filter.channels.filter((ch) => ch !== 'email'),
                          })
                        }
                      />
                      Email
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={filter.channels.includes('inApp')}
                        onCheckedChange={(c) =>
                          handleEventFilterChange(filter.id, {
                            channels: c
                              ? (filter.channels.includes('inApp') ? filter.channels : [...filter.channels, 'inApp'])
                              : filter.channels.filter((ch) => ch !== 'inApp'),
                          })
                        }
                      />
                      In-app
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={filter.channels.includes('webhook')}
                        onCheckedChange={(c) =>
                          handleEventFilterChange(filter.id, {
                            channels: c
                              ? (filter.channels.includes('webhook') ? filter.channels : [...filter.channels, 'webhook'])
                              : filter.channels.filter((ch) => ch !== 'webhook'),
                          })
                        }
                      />
                      Webhook
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveEventFilter(filter.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { id: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'flex h-9 w-[180px] rounded-lg border border-input bg-background px-3 py-1 text-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      )}
    >
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
