import { createContext } from 'react'

export interface SidebarContextValue {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)
