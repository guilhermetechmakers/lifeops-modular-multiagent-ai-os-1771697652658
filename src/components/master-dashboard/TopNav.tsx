import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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

const ORGS = [
  { id: '1', name: 'LifeOps Team' },
  { id: '2', name: 'Personal' },
]

function getSearchTarget(query: string): string {
  const q = query.toLowerCase().trim()
  if (q.includes('agent') || q.includes('bot')) return '/dashboard/agent-directory'
  if (q.includes('cronjob') || q.includes('schedule') || q.includes('job')) return '/dashboard/cronjobs'
  if (q.includes('workflow') || q.includes('template')) return '/dashboard/templates'
  if (q.includes('run') || q.includes('execution')) return '/dashboard/cronjobs'
  if (q.includes('approval')) return '/dashboard/approvals'
  if (q.includes('audit')) return '/dashboard/audit'
  return '/dashboard/overview'
}

export function TopNav() {
  const navigate = useNavigate()
  const [selectedOrg, setSelectedOrg] = useState(ORGS[0])
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const target = getSearchTarget(searchQuery)
    navigate(searchQuery ? `${target}?q=${encodeURIComponent(searchQuery)}` : target)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/95 px-6',
        'backdrop-blur supports-[backdrop-filter]:bg-background/60'
      )}
    >
      <form onSubmit={handleSearch} className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            placeholder="Search agents, cronjobs, runs..."
            className="pl-9 bg-muted/50 border-border transition-all duration-200 focus:border-primary/50"
            aria-label="Global search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 min-w-[140px] justify-between transition-all duration-200 hover:scale-[1.02] hover:bg-muted/50 hover:shadow-md"
            >
              <span className="truncate">{selectedOrg.name}</span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
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
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:from-primary/90 hover:to-primary/70"
            >
              <Plus className="h-4 w-4" />
              Quick Create
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => navigate('/dashboard/cronjobs?create=true')}
              className="gap-2 cursor-pointer"
            >
              <Clock className="h-4 w-4" />
              Cronjob
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/dashboard/templates')}
              className="gap-2 cursor-pointer"
            >
              <GitBranch className="h-4 w-4" />
              Workflow
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/dashboard/agent-directory')}
              className="gap-2 cursor-pointer"
            >
              <Bot className="h-4 w-4" />
              Agent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </form>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="rounded-full transition-transform duration-200 hover:scale-105"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 gap-2 pl-2 pr-2 rounded-full transition-transform duration-200 hover:scale-[1.02]"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 opacity-50" aria-hidden />
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
              <Link to="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
