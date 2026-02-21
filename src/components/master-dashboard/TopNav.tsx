import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Bell, ChevronDown, Plus, Clock, GitBranch, Bot, Menu } from 'lucide-react'
import { useSidebar } from '@/contexts/use-sidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GlobalSearchModal } from '@/components/master-dashboard/GlobalSearchModal'
import { cn } from '@/lib/utils'

const ORGS = [
  { id: '1', name: 'LifeOps Team' },
  { id: '2', name: 'Personal' },
]

export function TopNav() {
  const navigate = useNavigate()
  const { setMobileOpen } = useSidebar()
  const [selectedOrg, setSelectedOrg] = useState(ORGS[0])
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <GlobalSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <header
        className={cn(
          'sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/95 px-6',
          'backdrop-blur supports-[backdrop-filter]:bg-background/60'
        )}
      >
        <div className="flex flex-1 items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10 shrink-0"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </Button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className={cn(
              'relative flex flex-1 max-w-md items-center gap-3 rounded-lg border border-border px-3 py-2',
              'bg-muted/50 text-muted-foreground transition-all duration-200',
              'hover:bg-muted/70 hover:border-primary/30 hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
            aria-label="Open global search (Cmd+K)"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="text-sm">Search agents, cronjobs, runs...</span>
            <kbd className="ml-auto hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium">
              ⌘K
            </kbd>
          </button>
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
              onClick={() => navigate('/dashboard/templates?create=true')}
              className="gap-2 cursor-pointer"
            >
              <GitBranch className="h-4 w-4" />
              Workflow
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/dashboard/agent-directory?create=true')}
              className="gap-2 cursor-pointer"
            >
              <Bot className="h-4 w-4" />
              Agent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
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
    </>
  )
}
