import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Smartphone,
  Monitor,
  LogOut,
  Download,
  Activity,
  CheckCircle,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { SecuritySettings as SecuritySettingsType, Session } from '@/types/user-profile'
import { useUpdateSecuritySettings } from '@/hooks/use-user-profile'

interface SecurityProps {
  securitySettings?: SecuritySettingsType
  isLoading?: boolean
}

const MOCK_SESSIONS: Session[] = [
  {
    id: '1',
    device: 'Chrome on macOS',
    location: 'San Francisco, US',
    last_active: new Date().toISOString(),
    current: true,
  },
  {
    id: '2',
    device: 'Safari on iPhone',
    location: 'San Francisco, US',
    last_active: new Date(Date.now() - 86400000).toISOString(),
    current: false,
  },
]

const MOCK_ACTIVITY = [
  { id: '1', action: 'Login', timestamp: new Date().toISOString(), details: 'Successful login' },
  { id: '2', action: 'Profile update', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'Updated timezone' },
  { id: '3', action: 'API key created', timestamp: new Date(Date.now() - 7200000).toISOString(), details: 'Production API' },
]

export function Security({ securitySettings, isLoading }: SecurityProps) {
  const updateMutation = useUpdateSecuritySettings()
  const twoFaEnabled = securitySettings?.two_fa_enabled ?? false
  const sessions = securitySettings?.sessions?.length
    ? securitySettings.sessions
    : MOCK_SESSIONS

  const handle2FAToggle = (checked: boolean) => {
    updateMutation.mutate({
      two_fa_enabled: checked,
      sessions: securitySettings?.sessions ?? sessions,
    })
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Shield className="h-5 w-5 text-primary" />
          Security
        </CardTitle>
        <CardDescription>
          2FA setup, sessions list, activity log and exportable audit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-secondary/50">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label className="text-base font-medium">Two-factor authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <Switch
            checked={twoFaEnabled}
            onCheckedChange={handle2FAToggle}
            disabled={updateMutation.isPending}
          />
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Active sessions
          </Label>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-4 transition-all duration-200',
                  'hover:shadow-md hover:border-primary/30',
                  'border-border'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {session.device ?? 'Unknown device'}
                      {session.current && (
                        <Badge variant="success" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session.location ?? 'Unknown'} • Last active:{' '}
                      {new Date(session.last_active).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <LogOut className="h-4 w-4 mr-1" />
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent activity
          </Label>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {MOCK_ACTIVITY.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <div>
                      <p className="font-medium text-sm">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">{entry.details}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full sm:w-auto transition-all duration-200 hover:scale-[1.02]"
        >
          <Download className="h-4 w-4 mr-2" />
          Export audit log
        </Button>
      </CardContent>
    </Card>
  )
}
