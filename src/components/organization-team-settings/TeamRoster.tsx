import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, UserPlus, Mail, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TeamRosterData, TeamMember } from '@/types/organization-team-settings'
import { EmptyState } from '@/components/ui/empty-state'
import { useUpdateTeamRoster } from '@/hooks/use-organization-team-settings'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TeamRosterProps {
  data: TeamRosterData
  isLoading?: boolean
}

export function TeamRoster({ data, isLoading }: TeamRosterProps) {
  const updateMutation = useUpdateTeamRoster()
  const [inviteEmail, setInviteEmail] = useState('')
  const [showInvite, setShowInvite] = useState(false)

  const members = data?.members ?? []
  const totalSeats = data?.totalSeats ?? 5
  const usedSeats = data?.usedSeats ?? 0
  const roles = data?.roles ?? []

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      email: inviteEmail.trim(),
      role: 'member',
      status: 'pending',
      seatAllocated: true,
      invitedAt: new Date().toISOString(),
    }
    const updatedMembers = [...members, newMember]
    updateMutation.mutate({
      ...data,
      members: updatedMembers,
      usedSeats: usedSeats + 1,
    })
    setInviteEmail('')
    setShowInvite(false)
  }

  const handleRemoveMember = (memberId: string) => {
    const updatedMembers = members.filter((m) => m.id !== memberId)
    const removed = members.find((m) => m.id === memberId)
    const wasAllocated = removed?.seatAllocated ?? false
    updateMutation.mutate({
      ...data,
      members: updatedMembers,
      usedSeats: wasAllocated ? usedSeats - 1 : usedSeats,
    })
  }

  const handleRoleChange = (memberId: string, role: string) => {
    const updatedMembers = members.map((m) =>
      m.id === memberId ? { ...m, role } : m
    )
    updateMutation.mutate({ ...data, members: updatedMembers })
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary" />
              Team Roster
            </CardTitle>
            <CardDescription>
              Invite and manage members, roles, and seat allocation
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-sm">
              <span className="font-medium text-foreground">{usedSeats}</span>
              <span className="text-muted-foreground"> / {totalSeats} seats</span>
            </div>
            <Button
              size="sm"
              onClick={() => setShowInvite(!showInvite)}
              disabled={usedSeats >= totalSeats || updateMutation.isPending}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showInvite && (
          <div className="flex flex-col sm:flex-row gap-2 rounded-lg border border-border bg-muted/20 p-4 animate-fade-in">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleInvite} disabled={updateMutation.isPending}>
                Send invite
              </Button>
              <Button variant="outline" onClick={() => setShowInvite(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {members.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8">
            <EmptyState
              icon={Users}
              heading="No team members yet"
              description="Invite colleagues to collaborate. They will receive an email to join your organization."
              action={
                <Button onClick={() => setShowInvite(true)} className="transition-all duration-200 hover:scale-[1.02]">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite first member
                </Button>
              }
            />
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-lg border border-border p-4 transition-all duration-200 hover:bg-secondary/30 hover:shadow-sm"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {(member.name ?? member.email).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{member.name || member.email}</p>
                  <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={member.status === 'active' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {member.status}
                  </Badge>
                  <Select
                    value={member.role}
                    onValueChange={(v) => handleRoleChange(member.id, v)}
                    disabled={updateMutation.isPending}
                  >
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove from team
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
