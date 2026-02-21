import { Plug, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const connectors = [
  { id: '1', name: 'GitHub', status: 'connected', health: 'healthy' },
  { id: '2', name: 'Google Calendar', status: 'connected', health: 'healthy' },
  { id: '3', name: 'Plaid', status: 'disconnected', health: null },
  { id: '4', name: 'Slack', status: 'disconnected', health: null },
]

export function Connectors() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Integration Connectors</h1>
        <p className="text-muted-foreground mt-1">
          Catalog and configure external connectors
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connector Catalog</CardTitle>
          <CardDescription>
            OAuth/API key setup, secrets management, health panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {connectors.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Plug className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <Badge variant={c.status === 'connected' ? 'success' : 'secondary'}>
                      {c.status === 'connected' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {c.status}
                    </Badge>
                  </div>
                </div>
                <Button variant={c.status === 'connected' ? 'outline' : 'default'} size="sm">
                  {c.status === 'connected' ? 'Configure' : 'Connect'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
