import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Profile() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-muted-foreground mt-1">
          Profile info, connections, API keys, security
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">Change avatar</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="user@lifeops.io" />
                </div>
              </div>
              <Button>Save changes</Button>
            </TabsContent>
            <TabsContent value="api" className="mt-6">
              <p className="text-muted-foreground">Manage API keys for developer access</p>
              <Button variant="outline" className="mt-4">Create API Key</Button>
            </TabsContent>
            <TabsContent value="security" className="mt-6">
              <p className="text-muted-foreground">2FA, session management</p>
              <Button variant="outline" className="mt-4">Enable 2FA</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
