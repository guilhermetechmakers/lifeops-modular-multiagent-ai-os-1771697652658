import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Activity,
  ChevronRight,
  UserPlus,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { useOrganizationTeamSettings } from '@/hooks/use-organization-team-settings'
import { fetchAdminAudit } from '@/api/admin'
import type { AuditItem } from '@/types/master-dashboard'
import { cn } from '@/lib/utils'

const ADMIN_AUDIT_QUERY_KEY = ['admin-audit'] as const

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function Admin() {
  const navigate = useNavigate()
  const {
    data: orgData,
    isLoading: usersLoading,
    isError: usersError,
    refetch: refetchUsers,
  } = useOrganizationTeamSettings()

  const {
    data: auditData,
    isLoading: auditLoading,
    isError: auditError,
    refetch: refetchAudit,
  } = useQuery({
    queryKey: ADMIN_AUDIT_QUERY_KEY,
    queryFn: fetchAdminAudit,
    staleTime: 60 * 1000,
  })

  const members = orgData?.team_roster?.members ?? []
  const auditItems: AuditItem[] = auditData?.items ?? []

  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Admin | LifeOps'
    return () => {
      document.title = prevTitle
    }
  }, [])

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-accent">
              Admin
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage users and view audit logs across your organization
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/overview')}
          className="gap-1 w-fit transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Users List Card */}
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Users
                </CardTitle>
                <CardDescription>
                  Organization members and their roles
                </CardDescription>
              </div>
              {!usersError && !usersLoading && members.length > 0 && (
                <div className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-sm shrink-0">
                  <span className="font-medium text-foreground">
                    {orgData?.team_roster?.usedSeats ?? 0}
                  </span>
                  <span className="text-muted-foreground">
                    {' '}/ {orgData?.team_roster?.totalSeats ?? 5} seats
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {usersError ? (
              <ErrorState
                heading="Failed to load users"
                description="There was a problem loading the user list. Please try again."
                onRetry={() => refetchUsers()}
              />
            ) : usersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : members.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 sm:p-8 min-h-[200px] flex flex-col justify-center animate-fade-in bg-muted/20">
                <EmptyState
                  icon={Users}
                  heading="No users yet"
                  description="Invite team members to collaborate. They will receive an email to join your organization."
                  action={
                    <Button
                      onClick={() => navigate('/dashboard/organization-team-settings')}
                      className="transition-all duration-200 hover:scale-[1.02]"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite users
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="space-y-3">
                {members.slice(0, 5).map((member) => (
                  <div
                    key={member.id}
                    className={cn(
                      'flex items-center gap-4 rounded-xl border border-border p-4',
                      'transition-all duration-300 hover:bg-muted/30 hover:border-primary/20 hover:shadow-sm'
                    )}
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {(member.name ?? member.email).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{member.name || member.email}</p>
                      <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                    </div>
                    <Badge
                      variant={member.status === 'active' ? 'default' : 'secondary'}
                      className="capitalize shrink-0"
                    >
                      {member.status}
                    </Badge>
                  </div>
                ))}
                {members.length > 5 && (
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => navigate('/dashboard/organization-team-settings')}
                  >
                    View all {members.length} users
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit Log Card */}
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Audit Log
            </CardTitle>
            <CardDescription>
              Recent significant actions across the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {auditError ? (
              <ErrorState
                heading="Failed to load audit log"
                description="There was a problem loading the audit log. Please try again."
                onRetry={() => refetchAudit()}
              />
            ) : auditLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : auditItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 sm:p-8 min-h-[200px] flex flex-col justify-center animate-fade-in bg-muted/20">
                <EmptyState
                  icon={Activity}
                  heading="No audit entries"
                  description="Significant actions will appear here for traceability."
                  action={
                    <Button
                      variant="outline"
                      onClick={() => navigate('/dashboard/audit')}
                      className="transition-all duration-200 hover:scale-[1.02]"
                    >
                      View full audit logs
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="space-y-3">
                {auditItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border p-4',
                      'transition-all duration-300 hover:bg-muted/30 hover:border-primary/20'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{item.action}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.entity}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 sm:text-right">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => navigate('/dashboard/audit')}
                >
                  View full audit logs
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inline error banner for API issues */}
      {(usersError || auditError) && (
        <div
          className={cn(
            'flex items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4',
            'animate-fade-in'
          )}
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-6 w-6 shrink-0 text-destructive" />
          <p className="text-sm text-foreground flex-1">
            Some data could not be loaded. Use the retry buttons above to try again.
          </p>
        </div>
      )}
    </div>
  )
}

export default Admin
