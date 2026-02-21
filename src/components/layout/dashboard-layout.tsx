import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Sidebar, SidebarNavContent } from '@/components/layout/sidebar'
import { TopNav } from '@/components/master-dashboard/TopNav'
import { useSidebar } from '@/contexts/use-sidebar'
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { LifeOpsLogo } from '@/components/design-system'
import { Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar()
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname, setMobileOpen])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="flex w-64 flex-col gap-0 p-0"
          showCloseButton
        >
          <SheetHeader className="flex h-14 shrink-0 items-center border-b border-border px-4">
            <LifeOpsLogo size="md" variant="gradient" asLink />
          </SheetHeader>
          <div className="flex flex-1 flex-col overflow-hidden">
            <SidebarNavContent collapsed={false} />
          </div>
          <footer className="shrink-0 border-t border-border p-4">
            <NavLink to="/">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Home className="h-4 w-4 shrink-0" aria-hidden />
                Back to Home
              </Button>
            </NavLink>
          </footer>
        </SheetContent>
      </Sheet>
      <div
        className={cn(
          'transition-all duration-300',
          'pl-0',
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        )}
      >
        <TopNav />
        <main className="p-4 sm:p-6" role="main" aria-label="Dashboard content">
          <h1 className="sr-only">LifeOps Dashboard</h1>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
