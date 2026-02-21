import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, Zap, Database, FlaskConical } from 'lucide-react'
import { useSettingsPreferences } from '@/hooks/use-settings-preferences'
import { NotificationRules } from '@/components/settings-preferences/NotificationRules'
import { AutomationDefaults } from '@/components/settings-preferences/AutomationDefaults'
import { DataRetention } from '@/components/settings-preferences/DataRetention'
import { DeveloperSettings } from '@/components/settings-preferences/DeveloperSettings'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

const DEFAULT_RULES = {
  email: true,
  inApp: true,
  webhook: false,
  eventFilters: [],
}

const DEFAULT_RETENTION = {
  runHistoryDays: 90,
  exportEnabled: true,
}

const DEFAULT_DEV_SETTINGS = {
  webhookEndpoints: [],
  sdkTokens: [],
  sandboxMode: false,
}

export default function SettingsPreferences() {
  const { data, isLoading, isError, refetch } = useSettingsPreferences()

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Settings & Preferences</h1>
          <p className="text-muted-foreground mt-1">
            Notification rules, automation defaults, data retention
          </p>
        </div>
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-lg font-semibold mb-2">Failed to load settings</h2>
          <p className="text-sm text-muted-foreground mb-4">
            There was a problem loading your settings. Please try again.
          </p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings & Preferences</h1>
        <p className="text-muted-foreground mt-1">
          Notification rules, automation defaults, data retention, and developer settings
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : (
        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 p-1 h-auto">
            <TabsTrigger value="notifications" className="flex items-center gap-2 py-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2 py-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Automation</span>
            </TabsTrigger>
            <TabsTrigger value="retention" className="flex items-center gap-2 py-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
            <TabsTrigger value="developer" className="flex items-center gap-2 py-2">
              <FlaskConical className="h-4 w-4" />
              <span className="hidden sm:inline">Developer</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="notifications" className="mt-6 animate-fade-in">
            <NotificationRules
              rules={data?.notification_rules ?? DEFAULT_RULES}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="automation" className="mt-6 animate-fade-in">
            <AutomationDefaults
              defaults={data?.automation_defaults ?? {}}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="retention" className="mt-6 animate-fade-in">
            <DataRetention
              retention={data?.data_retention ?? DEFAULT_RETENTION}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="developer" className="mt-6 animate-fade-in">
            <DeveloperSettings
              settings={data?.developer_settings ?? DEFAULT_DEV_SETTINGS}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
