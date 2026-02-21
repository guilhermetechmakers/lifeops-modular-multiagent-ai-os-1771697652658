import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Bot, Clock, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RBACPoliciesData } from '@/types/organization-team-settings'
import { useUpdateRBACPolicies } from '@/hooks/use-organization-team-settings'

interface RBACPoliciesProps {
  data: RBACPoliciesData
  isLoading?: boolean
}

const PERMISSION_OPTIONS = [
  { id: 'agents:read', label: 'View agents' },
  { id: 'agents:run', label: 'Run agents' },
  { id: 'agents:create', label: 'Create agents' },
  { id: 'agents:delete', label: 'Delete agents' },
  { id: 'cronjobs:read', label: 'View cronjobs' },
  { id: 'cronjobs:run', label: 'Run cronjobs' },
  { id: 'cronjobs:create', label: 'Create cronjobs' },
  { id: 'cronjobs:delete', label: 'Delete cronjobs' },
  { id: 'settings:read', label: 'View settings' },
  { id: 'settings:write', label: 'Edit settings' },
  { id: '*', label: 'Full access' },
]

export function RBACPolicies({ data, isLoading }: RBACPoliciesProps) {
  const updateMutation = useUpdateRBACPolicies()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const roles = data?.roles ?? []

  const handleTogglePermission = (roleId: string, permission: string) => {
    const role = roles.find((r) => r.id === roleId)
    if (!role) return
    const hasWildcard = role.permissions.includes('*')
    let newPerms: string[]
    if (permission === '*') {
      newPerms = hasWildcard ? [] : ['*']
    } else {
      if (hasWildcard) {
        newPerms = PERMISSION_OPTIONS.filter((p) => p.id !== '*').map((p) => p.id)
        newPerms = newPerms.includes(permission)
          ? newPerms.filter((p) => p !== permission)
          : [...newPerms, permission]
      } else {
        const has = role.permissions.includes(permission)
        newPerms = has
          ? role.permissions.filter((p) => p !== permission)
          : [...role.permissions, permission]
      }
    }
    const updatedRoles = roles.map((r) =>
      r.id === roleId ? { ...r, permissions: newPerms } : r
    )
    updateMutation.mutate({ ...data, roles: updatedRoles })
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 animate-pulse rounded-lg bg-muted" />
            <div className="h-48 animate-pulse rounded-lg bg-muted" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Shield className="h-5 w-5 text-primary" />
          RBAC Policies
        </CardTitle>
        <CardDescription>
          Role definitions and permission matrix for agents and cronjobs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {roles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">No roles defined</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
              Define roles and permissions to control access for agents and cronjobs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Role definitions
              </h3>
              <div className="space-y-2">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
                    className={cn(
                      'rounded-lg border p-4 cursor-pointer transition-all duration-200',
                      selectedRole === role.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-secondary/30'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{role.name}</p>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                      <Badge variant="secondary">
                        {role.permissions.includes('*') ? 'Full' : role.permissions.length} perms
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Permission matrix
              </h3>
              {selectedRole ? (
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Toggle permissions for{' '}
                    <span className="font-medium text-foreground">
                      {roles.find((r) => r.id === selectedRole)?.name}
                    </span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PERMISSION_OPTIONS.map((opt) => {
                      const role = roles.find((r) => r.id === selectedRole)
                      const has = role?.permissions.includes('*') || role?.permissions.includes(opt.id)
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleTogglePermission(selectedRole, opt.id)}
                          disabled={updateMutation.isPending}
                          className={cn(
                            'flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-all duration-200',
                            has
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:bg-secondary/30'
                          )}
                        >
                          {has && <Check className="h-4 w-4 shrink-0" />}
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <Shield className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Select a role to edit its permissions
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
