import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Plug, Key, Bot, Shield, AlertCircle } from 'lucide-react'
import { useUserProfile } from '@/hooks/use-user-profile'
import { ProfileInfo } from '@/components/user-profile/ProfileInfo'
import { Connections } from '@/components/user-profile/Connections'
import { APIKeysTokens } from '@/components/user-profile/APIKeysTokens'
import { AgentPresets } from '@/components/user-profile/AgentPresets'
import { Security } from '@/components/user-profile/Security'
import { Button } from '@/components/ui/button'

export default function UserProfile() {
  const { data, isLoading, isError, refetch } = useUserProfile()

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage account settings, connected accounts, API keys, and preferences
          </p>
        </div>
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-lg font-semibold mb-2">Failed to load profile</h2>
          <p className="text-sm text-muted-foreground mb-4">
            There was a problem loading your profile. Please try again.
          </p>
          <Button onClick={() => refetch()} className="transition-all duration-200 hover:scale-105">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage account settings, connected accounts, API keys, preferences and personal agent presets
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="h-12 w-full max-w-md rounded-lg animate-pulse bg-muted" />
          <div className="h-96 w-full rounded-xl animate-pulse bg-muted" />
        </div>
      ) : (
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1 h-auto flex-wrap">
            <TabsTrigger value="profile" className="flex items-center gap-2 py-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center gap-2 py-2">
              <Plug className="h-4 w-4" />
              <span className="hidden sm:inline">Connections</span>
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center gap-2 py-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="agent-presets" className="flex items-center gap-2 py-2">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Agent Presets</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 py-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-6 animate-fade-in">
            <ProfileInfo profileInfo={data?.profile_info} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="connections" className="mt-6 animate-fade-in">
            <Connections connections={data?.connections} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="api-keys" className="mt-6 animate-fade-in">
            <APIKeysTokens apiKeys={data?.api_keys} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="agent-presets" className="mt-6 animate-fade-in">
            <AgentPresets agentPresets={data?.agent_presets} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="security" className="mt-6 animate-fade-in">
            <Security securitySettings={data?.security_settings} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
