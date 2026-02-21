import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Settings() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Settings & Preferences</h1>
        <p className="text-muted-foreground mt-1">
          Notification rules, automation defaults, data retention
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Global app settings and defaults
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notifications">
            <TabsList>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
              <TabsTrigger value="retention">Data Retention</TabsTrigger>
              <TabsTrigger value="developer">Developer</TabsTrigger>
            </TabsList>
            <TabsContent value="notifications" className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email for approvals and alerts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>In-app notifications</Label>
                  <p className="text-sm text-muted-foreground">Show in-app toasts</p>
                </div>
                <Switch defaultChecked />
              </div>
            </TabsContent>
            <TabsContent value="automation" className="mt-6">
              <p className="text-muted-foreground">Automation defaults</p>
            </TabsContent>
            <TabsContent value="retention" className="mt-6">
              <p className="text-muted-foreground">Data retention settings</p>
            </TabsContent>
            <TabsContent value="developer" className="mt-6">
              <p className="text-muted-foreground">Developer settings</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
