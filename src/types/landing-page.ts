/**
 * Landing page data types.
 * Aligns with landing_page table schema.
 */

export interface LandingPage {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface LandingPageCreate {
  title: string
  description?: string
  status?: string
}

export interface LandingPageUpdate {
  title?: string
  description?: string
  status?: string
}
