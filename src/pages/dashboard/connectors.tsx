import { useState } from 'react'
import { Plug, CheckCircle, GitBranch, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCicdCredentials, useCicdSaveCredentials, useCicdDeleteCredentials } from '@/hooks/use-cicd-provider'
import type { CicdProvider } from '@/types/cicd-provider'
import { Skeleton } from '@/components/ui/skeleton'

const connectors = [
  { id: '1', name: 'GitHub', status: 'connected', health: 'healthy' },
  { id: '2', name: 'Google Calendar', status: 'connected', health: 'healthy' },
  { id: '3', name: 'Plaid', status: 'disconnected', health: null },
  { id: '4', name: 'Slack', status: 'disconnected', health: null },
]

const cicdProviders: { id: CicdProvider; name: string }[] = [
  { id: 'github_actions', name: 'GitHub Actions' },
  { id: 'circleci', name: 'CircleCI' },
  { id: 'jenkins', name: 'Jenkins' },
]

function CicdCredentialDialog({
  provider,
  providerName,
  isConfigured,
  onSaved,
}: {
  provider: CicdProvider
  providerName: string
  isConfigured: boolean
  onSaved: () => void
}) {
  const [token, setToken] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [open, setOpen] = useState(false)
  const saveMutation = useCicdSaveCredentials()
  const deleteMutation = useCicdDeleteCredentials()

  const handleSave = () => {
    saveMutation.mutate(
      {
        provider,
        credentials: { token: token || undefined, baseUrl: baseUrl || undefined },
      },
      {
        onSuccess: () => {
          setOpen(false)
          setToken('')
          setBaseUrl('')
          onSaved()
        },
      }
    )
  }

  const handleDelete = () => {
    deleteMutation.mutate({ provider }, { onSuccess: () => setOpen(false) })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isConfigured ? 'outline' : 'default'} size="sm">
          {isConfigured ? 'Configure' : 'Connect'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            {providerName}
          </DialogTitle>
          <DialogDescription>
            Add API token or personal access token to trigger pipelines and fetch run statuses.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="token">API Token / Personal Access Token</Label>
            <Input
              id="token"
              type="password"
              placeholder="ghp_xxx or circleci token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoComplete="off"
            />
          </div>
          {provider === 'jenkins' && (
            <div className="space-y-2">
              <Label htmlFor="baseUrl">Jenkins Base URL</Label>
              <Input
                id="baseUrl"
                type="url"
                placeholder="https://jenkins.example.com"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          {isConfigured && (
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive mr-auto"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )}
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending || !token.trim()}>
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function Connectors() {
  const { data: cicdData, isLoading: cicdLoading } = useCicdCredentials()
  const cicdCreds = cicdData?.credentials ?? []
  const configuredProviders = new Set(cicdCreds.map((c) => c.provider))

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
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            CI/CD Providers
          </CardTitle>
          <CardDescription>
            Connect CircleCI, Jenkins, or GitHub Actions to trigger pipelines from Cronjobs and surface CI statuses on dashboards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cicdLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {cicdProviders.map((p) => {
                const isConfigured = configuredProviders.has(p.id)
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-all duration-300 hover:border-primary/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <GitBranch className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <Badge variant={isConfigured ? 'success' : 'secondary'}>
                          {isConfigured && <CheckCircle className="h-3 w-3 mr-1" />}
                          {isConfigured ? 'connected' : 'disconnected'}
                        </Badge>
                      </div>
                    </div>
                    <CicdCredentialDialog
                      provider={p.id}
                      providerName={p.name}
                      isConfigured={isConfigured}
                      onSaved={() => {}}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

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
