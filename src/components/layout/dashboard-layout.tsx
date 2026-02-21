import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/sidebar'
import { TopNav } from '@/components/master-dashboard/TopNav'
import { useSidebar } from '@/contexts/sidebar-context'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const { collapsed } = useSidebar()
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300',
          collapsed ? 'pl-[72px]' : 'pl-64'
        )}
      >
        <TopNav />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
