import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Plug, Key, Shield } from 'lucide-react'
import { useUserProfile } from '@/hooks/use-user-profile'
import { ProfileInfo } from '@/components/user-profile/ProfileInfo'
import { Connections } from '@/components/user-profile/Connections'
import { APIKeysTokens } from '@/components/user-profile/APIKeysTokens'
import { Security } from '@/components/user-profile/Security'
import { ErrorState } from '@/components/ui/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function Profile() {
  const { data, isLoading, isError, refetch } = useUserProfile()

  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            User Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Profile info, connections, API keys, security
          </p>
        </div>
        <ErrorState
          heading="Failed to load profile"
          description="There was a problem loading your profile. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          User Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Profile info, connections, API keys, security
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="h-12 w-full max-w-md rounded-lg">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 flex-1 rounded-lg" />
              ))}
            </div>
            <div className="mt-6 space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </div>
      ) : (
        <Tabs
          defaultValue="profile"
          className="space-y-6"
          aria-label="Profile sections"
        >
          <TabsList
            className={cn(
              'grid w-full grid-cols-2 sm:grid-cols-4 gap-2 p-1 h-auto flex-wrap',
              'bg-muted/50 border border-border'
            )}
          >
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 py-2 transition-all duration-200 hover:scale-[1.02]"
              aria-label="Profile information"
            >
              <User className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="connections"
              className="flex items-center gap-2 py-2 transition-all duration-200 hover:scale-[1.02]"
              aria-label="Connected services"
            >
              <Plug className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Connections</span>
            </TabsTrigger>
            <TabsTrigger
              value="api-keys"
              className="flex items-center gap-2 py-2 transition-all duration-200 hover:scale-[1.02]"
              aria-label="API keys and tokens"
            >
              <Key className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 py-2 transition-all duration-200 hover:scale-[1.02]"
              aria-label="Security settings"
            >
              <Shield className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6 animate-fade-in">
            <ProfileInfo
              profileInfo={data?.profile_info}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="connections" className="mt-6 animate-fade-in">
            <Connections
              connections={data?.connections}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="api-keys" className="mt-6 animate-fade-in">
            <APIKeysTokens
              apiKeys={data?.api_keys}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="security" className="mt-6 animate-fade-in">
            <Security
              securitySettings={data?.security_settings}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
