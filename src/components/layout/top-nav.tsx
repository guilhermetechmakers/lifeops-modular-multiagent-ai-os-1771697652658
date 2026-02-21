import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronDown, Plus, Clock, GitBranch, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

/** Consistent icon size for top nav - matches design system */
const ICON_SIZE = 'h-4 w-4'
const ORGS = [
  { id: '1', name: 'LifeOps Team' },
  { id: '2', name: 'Personal' },
]

export function TopNav() {
  const navigate = useNavigate()
  const [selectedOrg, setSelectedOrg] = useState(ORGS[0])

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'md:gap-4 md:px-6'
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
        <div className="relative min-w-0 flex-1 max-w-md">
          <Search className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground', ICON_SIZE)} />
          <Input
            placeholder="Search agents, cronjobs, runs..."
            className="pl-9 bg-muted/50 border-border"
            aria-label="Global search"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 min-w-[120px] justify-between hover:bg-muted/50 transition-all duration-200 hover:scale-[1.02] md:min-w-[140px]"
            >
              <span className="truncate">{selectedOrg.name}</span>
              <ChevronDown className={cn('shrink-0 opacity-50', ICON_SIZE)} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Switch organization</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ORGS.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => setSelectedOrg(org)}
                className="cursor-pointer"
              >
                {org.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className={cn(
                'gap-2 bg-gradient-to-r from-primary to-primary/80',
                'hover:from-primary/90 hover:to-primary/70',
                'transition-all duration-200 hover:scale-[1.02] hover:shadow-glow'
              )}
            >
              <Plus className={ICON_SIZE} />
              Quick Create
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate('/dashboard/cronjobs')} className="gap-2 cursor-pointer">
              <Clock className={ICON_SIZE} />
              Cronjob
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/dashboard/templates')} className="gap-2 cursor-pointer">
              <GitBranch className={ICON_SIZE} />
              Workflow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/dashboard/agents')} className="gap-2 cursor-pointer">
              <Bot className={ICON_SIZE} />
              Agent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications" className="rounded-full">
          <Bell className={ICON_SIZE} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 gap-2 rounded-full pl-2 pr-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <ChevronDown className={cn('opacity-50', ICON_SIZE)} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Account</p>
                <p className="text-xs text-muted-foreground">user@lifeops.io</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/dashboard/profile">Profile</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/dashboard/settings">Settings</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
