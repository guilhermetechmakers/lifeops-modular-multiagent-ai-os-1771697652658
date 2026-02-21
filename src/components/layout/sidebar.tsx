import { useSidebar } from '@/contexts/sidebar-context'
import { NavLink } from 'react-router-dom'
import { LifeOpsLogo } from '@/components/design-system'
import {
  LayoutDashboard,
  Bot,
  FolderKanban,
  LayoutGrid,
  FileText,
  Wallet,
  Heart,
  Clock,
  GitBranch,
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
  UserCircle,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

/** Section config for sidebar navigation with semantic heading support */
interface NavSection {
  id: string
  heading: string
  items: Array<{ to: string; label: string; icon: typeof LayoutDashboard }>
}

const mainNav: NavSection = {
  id: 'main',
  heading: 'Main',
  items: [
    { to: '/dashboard/overview', label: 'Master Dashboard', icon: LayoutDashboard },
    { to: '/dashboard/agent-directory', label: 'Agent Directory', icon: Bot },
    { to: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
    { to: '/dashboard/module-projects', label: 'Module Projects', icon: LayoutGrid },
    { to: '/dashboard/content', label: 'Content', icon: FileText },
    { to: '/dashboard/finance', label: 'Finance', icon: Wallet },
    { to: '/dashboard/health', label: 'Health', icon: Heart },
  ],
}

const systemNav: NavSection = {
  id: 'system',
  heading: 'System',
  items: [
    { to: '/dashboard/cronjobs', label: 'Cronjobs', icon: Clock },
    { to: '/dashboard/workflows', label: 'Workflows', icon: GitBranch },
    { to: '/dashboard/templates', label: 'Templates', icon: Layers },
    { to: '/dashboard/approvals', label: 'Approvals', icon: CheckSquare },
    { to: '/dashboard/audit', label: 'Audit Logs', icon: Activity },
  ],
}

const configNav: NavSection = {
  id: 'config',
  heading: 'Configuration',
  items: [
    { to: '/dashboard/admin', label: 'Admin', icon: Shield },
    { to: '/dashboard/user-profile', label: 'User Profile', icon: UserCircle },
    { to: '/dashboard/connectors', label: 'Connectors', icon: Plug },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
    { to: '/dashboard/organization-team-settings', label: 'Team Settings', icon: Users },
    { to: '/docs-help', label: 'Docs & Help', icon: BookOpen },
  ],
}

const navSections = [mainNav, systemNav, configNav]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium',
    'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
    isActive
      ? 'bg-primary/10 text-primary border-l-2 border-primary'
      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
  )

/** Shared nav content for desktop sidebar and mobile drawer */
export function SidebarNavContent({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <ScrollArea className="flex-1 px-3 py-4">
      <nav aria-label="Main navigation" className="space-y-1">
        {navSections.map((section, sectionIndex) => (
          <section key={section.id} aria-labelledby={`sidebar-heading-${section.id}`}>
            <h2
              id={`sidebar-heading-${section.id}`}
              className={cn(
                'text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                collapsed ? 'sr-only' : 'mb-2 px-3'
              )}
            >
              {section.heading}
            </h2>
            <ul className="space-y-1" role="list">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={navLinkClass}>
                    <item.icon className="h-5 w-5 shrink-0" aria-hidden />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
            {sectionIndex < navSections.length - 1 && (
              <Separator className="my-4" aria-hidden />
            )}
          </section>
        ))}
      </nav>
    </ScrollArea>
  )
}

export function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar()

  return (
    <aside
      role="navigation"
      aria-label="Dashboard navigation"
      className={cn(
        'fixed left-0 top-0 z-40 hidden h-screen flex-col lg:flex',
        'border-r border-border bg-card shadow-card',
        'transition-all duration-300 ease-out',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <header className="flex h-14 min-h-[3.5rem] shrink-0 items-center justify-between border-b border-border px-3 sm:px-4">
        <LifeOpsLogo
          iconOnly={collapsed}
          size={collapsed ? 'sm' : 'md'}
          variant="gradient"
          asLink
          className={collapsed ? 'min-w-0 flex-1 justify-center' : ''}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="h-10 w-10 shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" aria-hidden />
          ) : (
            <ChevronLeft className="h-5 w-5" aria-hidden />
          )}
        </Button>
      </header>
      <SidebarNavContent collapsed={collapsed} />
      {!collapsed && (
        <footer className="shrink-0 border-t border-border p-4">
          <NavLink to="/">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Home className="h-4 w-4" aria-hidden />
              Back to Home
            </Button>
          </NavLink>
        </footer>
      )}
    </aside>
  )
}
