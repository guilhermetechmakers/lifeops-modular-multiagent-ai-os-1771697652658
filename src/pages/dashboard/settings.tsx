import { useState } from 'react'
import {
  Bell,
  BellOff,
  Code2,
  Database,
  Settings2,
  Plus,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function Settings() {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [notificationRules, setNotificationRules] = useState<unknown[]>([])
  const [automationRules, setAutomationRules] = useState<unknown[]>([])
  const [retentionPolicies, setRetentionPolicies] = useState<unknown[]>([])
  const [developerConfigs, setDeveloperConfigs] = useState<unknown[]>([])

  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 800)
  }

  if (hasError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings & Preferences</h1>
          <p className="text-muted-foreground mt-1">
            Notification rules, automation defaults, data retention
          </p>
        </div>
        <ErrorState
          heading="Failed to load settings"
          description="We couldn't load your preferences. Please try again."
          onRetry={handleRetry}
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-80 mt-2" />
        </div>
        <Card className="border-border">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-lg" />
              ))}
            </div>
            <div className="space-y-6">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          Notification rules, automation defaults, data retention
        </p>
      </div>

      <Card className="border-border shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="text-foreground">Preferences</CardTitle>
          <CardDescription className="text-muted-foreground">
            Global app settings and defaults
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notifications">
            <TabsList className="bg-muted text-muted-foreground w-full sm:w-auto flex flex-wrap gap-1 p-1 rounded-lg">
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="automation"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Automation
              </TabsTrigger>
              <TabsTrigger
                value="retention"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Data Retention
              </TabsTrigger>
              <TabsTrigger
                value="developer"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Developer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="mt-6 space-y-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border p-4 bg-card/50 transition-all duration-200 hover:border-primary/20">
                  <div>
                    <Label className="text-foreground">Email notifications</Label>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Receive email for approvals and alerts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border p-4 bg-card/50 transition-all duration-200 hover:border-primary/20">
                  <div>
                    <Label className="text-foreground">In-app notifications</Label>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Show in-app toasts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-2">Notification rules</h3>
                {notificationRules.length === 0 ? (
                  <EmptyState
                    icon={BellOff}
                    heading="No notification rules"
                    description="Create custom rules to control when and how you receive notifications for specific events."
                    action={
                      <Button
                        size="sm"
                        className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        onClick={() => setNotificationRules([{}])}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add rule
                      </Button>
                    }
                    className="rounded-xl border border-dashed border-border py-12 bg-muted/20"
                  />
                ) : (
                  <div className="space-y-2">
                    {notificationRules.map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-border p-4"
                      >
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-primary" />
                          <span className="text-sm text-foreground">Rule {i + 1}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setNotificationRules((p) => p.filter((_, j) => j !== i))
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="automation" className="mt-6">
              {automationRules.length === 0 ? (
                <EmptyState
                  icon={Settings2}
                  heading="No automation rules"
                  description="Set up automation defaults for workflows, triggers, and scheduled tasks."
                  action={
                    <Button
                      size="sm"
                      className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => setAutomationRules([{}])}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add automation
                    </Button>
                  }
                  className="rounded-xl border border-dashed border-border py-16 bg-muted/20"
                />
              ) : (
                <div className="space-y-4">
                  {automationRules.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center justify-between rounded-xl border border-border p-4',
                        'transition-all duration-300 hover:shadow-md hover:border-primary/20'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Settings2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          Automation {i + 1}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setAutomationRules((p) => p.filter((_, j) => j !== i))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="retention" className="mt-6">
              {retentionPolicies.length === 0 ? (
                <EmptyState
                  icon={Database}
                  heading="No retention policies"
                  description="Configure how long to keep logs, artifacts, and run history before automatic cleanup."
                  action={
                    <Button
                      size="sm"
                      className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => setRetentionPolicies([{}])}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add policy
                    </Button>
                  }
                  className="rounded-xl border border-dashed border-border py-16 bg-muted/20"
                />
              ) : (
                <div className="space-y-4">
                  {retentionPolicies.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center justify-between rounded-xl border border-border p-4',
                        'transition-all duration-300 hover:shadow-md hover:border-primary/20'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          Policy {i + 1}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setRetentionPolicies((p) => p.filter((_, j) => j !== i))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="developer" className="mt-6">
              {developerConfigs.length === 0 ? (
                <EmptyState
                  icon={Code2}
                  heading="No developer settings"
                  description="Add API keys, webhooks, or custom integrations for development and testing."
                  action={
                    <Button
                      size="sm"
                      className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => setDeveloperConfigs([{}])}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add config
                    </Button>
                  }
                  className="rounded-xl border border-dashed border-border py-16 bg-muted/20"
                />
              ) : (
                <div className="space-y-4">
                  {developerConfigs.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center justify-between rounded-xl border border-border p-4',
                        'transition-all duration-300 hover:shadow-md hover:border-primary/20'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          Config {i + 1}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setDeveloperConfigs((p) => p.filter((_, j) => j !== i))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
