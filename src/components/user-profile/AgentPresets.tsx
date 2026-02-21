import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bot, Brain, MessageSquare } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { AgentPresets as AgentPresetsType } from '@/types/user-profile'
import { useUpdateAgentPresets } from '@/hooks/use-user-profile'

const BEHAVIOR_OPTIONS = [
  { value: 'helpful', label: 'Helpful & Cooperative' },
  { value: 'concise', label: 'Concise & Direct' },
  { value: 'creative', label: 'Creative & Exploratory' },
  { value: 'analytical', label: 'Analytical & Detailed' },
]

const MEMORY_SCOPE_OPTIONS = [
  { value: 'session', label: 'Session only' },
  { value: 'project', label: 'Project scope' },
  { value: 'global', label: 'Global context' },
]

interface AgentPresetsProps {
  agentPresets?: AgentPresetsType
  isLoading?: boolean
}

export function AgentPresets({ agentPresets, isLoading }: AgentPresetsProps) {
  const updateMutation = useUpdateAgentPresets()
  const [localPresets, setLocalPresets] = useState<AgentPresetsType>(
    agentPresets ?? {
      default_behavior: 'helpful',
      memory_scope: 'project',
      temperature: 0.7,
    }
  )

  useEffect(() => {
    if (agentPresets) {
      queueMicrotask(() => setLocalPresets(agentPresets))
    }
  }, [agentPresets])

  const handleSave = () => {
    updateMutation.mutate(localPresets)
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Bot className="h-5 w-5 text-primary" />
          Agent Presets
        </CardTitle>
        <CardDescription>
          Personal default agent behaviors and memory scope controls
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Default behavior
          </Label>
          <Select
            value={localPresets.default_behavior ?? 'helpful'}
            onValueChange={(v) =>
              setLocalPresets((p) => ({ ...p, default_behavior: v }))
            }
          >
            <SelectTrigger className="transition-colors focus:ring-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BEHAVIOR_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Memory scope
          </Label>
          <Select
            value={localPresets.memory_scope ?? 'project'}
            onValueChange={(v) =>
              setLocalPresets((p) => ({
                ...p,
                memory_scope: v as 'session' | 'project' | 'global',
              }))
            }
          >
            <SelectTrigger className="transition-colors focus:ring-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEMORY_SCOPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Temperature</Label>
          <Select
            value={String(localPresets.temperature ?? 0.7)}
            onValueChange={(v) =>
              setLocalPresets((p) => ({ ...p, temperature: parseFloat(v) }))
            }
          >
            <SelectTrigger className="transition-colors focus:ring-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0.3, 0.5, 0.7, 0.9, 1.0].map((t) => (
                <SelectItem key={t} value={String(t)}>
                  {t.toFixed(1)} {t < 0.5 ? '(Focused)' : t < 0.8 ? '(Balanced)' : '(Creative)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save presets'}
        </Button>
      </CardContent>
    </Card>
  )
}
