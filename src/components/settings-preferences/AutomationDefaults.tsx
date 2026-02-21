import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bot, Zap, Shield, Gauge } from 'lucide-react'
import type { AutomationDefaults as AutomationDefaultsType, AutomationLevel } from '@/types/settings-preferences'
import { useUpdateAutomationDefaults } from '@/hooks/use-settings-preferences'

const MODULES = [
  { id: 'cronjobs', label: 'Cronjobs', icon: Zap },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'approvals', label: 'Approvals', icon: Shield },
  { id: 'connectors', label: 'Connectors', icon: Gauge },
] as const

const AUTOMATION_LEVELS: { value: AutomationLevel; label: string; description: string }[] = [
  { value: 'suggest-only', label: 'Suggest only', description: 'AI suggests, user decides' },
  { value: 'approval-required', label: 'Approval required', description: 'Requires explicit approval before execution' },
  { value: 'auto', label: 'Auto execute', description: 'Runs automatically within defined bounds' },
  { value: 'bounded-autopilot', label: 'Bounded autopilot', description: 'Full automation with safety limits' },
]

interface AutomationDefaultsProps {
  defaults: AutomationDefaultsType
  isLoading?: boolean
}

export function AutomationDefaults({ defaults, isLoading }: AutomationDefaultsProps) {
  const updateMutation = useUpdateAutomationDefaults()
  const [localDefaults, setLocalDefaults] = useState<AutomationDefaultsType>(defaults ?? {})

  const handleChange = (moduleId: string, level: AutomationLevel) => {
    const next = { ...localDefaults, [moduleId]: level }
    setLocalDefaults(next)
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
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-10 w-40 animate-pulse rounded-lg bg-muted" />
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
          <Zap className="h-5 w-5 text-primary" />
          Automation Defaults
        </CardTitle>
        <CardDescription>
          Default automation levels (suggest-only, approval-required, auto) per module
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {MODULES.map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-secondary/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label className="text-base font-medium">{label}</Label>
                <p className="text-sm text-muted-foreground">
                  {AUTOMATION_LEVELS.find((l) => l.value === (localDefaults[id] ?? 'suggest-only'))?.description ??
                    'AI suggests, user decides'}
                </p>
              </div>
            </div>
            <Select
              value={localDefaults[id] ?? 'suggest-only'}
              onValueChange={(v) => handleChange(id, v as AutomationLevel)}
              disabled={updateMutation.isPending}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AUTOMATION_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
