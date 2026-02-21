import { useSidebar } from '@/contexts/sidebar-context'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Bot,
  FolderKanban,
  LayoutGrid,
  FileText,
  Wallet,
  Heart,
  Clock,
  Layers,
  CheckSquare,
  Settings,
  Plug,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Home,
  Activity,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

const mainNav = [
  { to: '/dashboard/overview', label: 'Master Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/agent-directory', label: 'Agent Directory', icon: Bot },
  { to: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { to: '/dashboard/module-projects', label: 'Module Projects', icon: LayoutGrid },
  { to: '/dashboard/content', label: 'Content', icon: FileText },
  { to: '/dashboard/finance', label: 'Finance', icon: Wallet },
  { to: '/dashboard/health', label: 'Health', icon: Heart },
]

const systemNav = [
  { to: '/dashboard/cronjobs', label: 'Cronjobs', icon: Clock },
  { to: '/dashboard/templates', label: 'Templates', icon: Layers },
  { to: '/dashboard/approvals', label: 'Approvals', icon: CheckSquare },
  { to: '/dashboard/audit', label: 'Audit Logs', icon: Activity },
]

const configNav = [
  { to: '/dashboard/connectors', label: 'Connectors', icon: Plug },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/dashboard/organization-team-settings', label: 'Team Settings', icon: Users },
  { to: '/docs', label: 'Docs & Help', icon: BookOpen },
]

export function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar()

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-primary/10 text-primary border-l-2 border-primary'
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
    )

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">LifeOps</span>
          </NavLink>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {mainNav.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
          <Separator className="my-4" />
          {systemNav.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
          <Separator className="my-4" />
          {configNav.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
      {!collapsed && (
        <div className="border-t border-border p-4">
          <NavLink to="/">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </NavLink>
        </div>
      )}
    </aside>
  )
}
