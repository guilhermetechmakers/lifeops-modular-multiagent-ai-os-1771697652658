import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Key, Plus, Trash2, Copy, BarChart2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ApiKey } from '@/types/user-profile'
import { useCreateApiKey, useRevokeApiKey } from '@/hooks/use-user-profile'
import { toast } from 'sonner'

interface APIKeysTokensProps {
  apiKeys?: ApiKey[]
  isLoading?: boolean
}

export function APIKeysTokens({ apiKeys = [], isLoading }: APIKeysTokensProps) {
  const createMutation = useCreateApiKey()
  const revokeMutation = useRevokeApiKey()
  const [newKeyName, setNewKeyName] = useState('')
  const [open, setOpen] = useState(false)

  const handleCreate = () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name')
      return
    }
    createMutation.mutate(
      { name: newKeyName.trim() },
      {
        onSuccess: () => {
          setNewKeyName('')
          setOpen(false)
        },
      }
    )
  }

  const copyPrefix = (prefix: string) => {
    navigator.clipboard.writeText(prefix + '••••••••••••')
    toast.success('Copied to clipboard')
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg mt-4" />
        </CardContent>
      </Card>
    )
  }

  const empty = apiKeys.length === 0

  if (empty) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Key className="h-5 w-5 text-primary" />
            API Keys & Tokens
          </CardTitle>
          <CardDescription>
            Create, revoke, scope and rotate keys with usage metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No API keys</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Create API keys for developer access, integrations, and automation
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="transition-all duration-200 hover:scale-[1.02]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>
                    Give your key a descriptive name to identify it later
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Key name</Label>
                    <Input
                      id="key-name"
                      placeholder="e.g. Production API"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Key className="h-5 w-5 text-primary" />
            API Keys & Tokens
          </CardTitle>
          <CardDescription>
            Create, revoke, scope and rotate keys with usage metrics
          </CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="transition-all duration-200 hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Give your key a descriptive name to identify it later
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key name</Label>
                <Input
                  id="key-name"
                  placeholder="e.g. Production API"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKeys.map((key) => (
          <div
            key={key.id}
            className={cn(
              'flex items-center justify-between rounded-xl border p-4 transition-all duration-200',
              'hover:shadow-md hover:border-primary/30',
              'border-border'
            )}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{key.name}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <code className="bg-muted px-2 py-0.5 rounded">
                    {key.prefix}••••••••••••
                  </code>
                  <span className="flex items-center gap-1">
                    <BarChart2 className="h-3 w-3" />
                    {key.usage_count ?? 0} uses
                  </span>
                  {key.last_used_at && (
                    <span>Last used: {new Date(key.last_used_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyPrefix(key.prefix)}
                className="h-8 w-8"
                aria-label={`Copy API key prefix for ${key.name}`}
              >
                <Copy className="h-4 w-4" aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => revokeMutation.mutate(key.id)}
                disabled={revokeMutation.isPending}
                className="h-8 w-8 text-destructive hover:text-destructive"
                aria-label={`Revoke API key ${key.name}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
