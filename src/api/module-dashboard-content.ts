import { supabase } from '@/lib/supabase'
import type { ModuleDashboardContentPayload } from '@/types/module-dashboard-content'

const MOCK_PAYLOAD: ModuleDashboardContentPayload = {
  ideas: [
    { id: '1', title: 'AI-powered content workflows', outline: '1. Intro\n2. Use cases\n3. Guide', priorityScore: 92, status: 'outlined', createdAt: new Date().toISOString(), agentSuggested: true },
    { id: '2', title: 'Multi-agent collaboration', outline: '1. Roles\n2. Handoffs\n3. Practices', priorityScore: 88, status: 'new', createdAt: new Date().toISOString(), agentSuggested: true },
    { id: '3', title: 'CMS integration deep dive', outline: '1. WordPress\n2. Contentful\n3. Sync', priorityScore: 85, status: 'drafting', createdAt: new Date().toISOString(), agentSuggested: false },
  ],
  calendarSlots: [],
  drafts: [
    { id: '1', contentId: '1', version: 2, content: '<p>AI-powered content workflows...</p>', seoScore: 78, createdAt: new Date().toISOString() },
    { id: '2', contentId: '2', version: 1, content: '<p>Multi-agent collaboration...</p>', seoScore: 82, createdAt: new Date().toISOString() },
  ],
  connectors: [
    { id: '1', type: 'wordpress', name: 'blog.example.com', connected: true, lastSync: new Date().toISOString(), health: 'healthy' },
    { id: '2', type: 'contentful', name: 'Contentful Space', connected: true, lastSync: new Date().toISOString(), health: 'healthy' },
    { id: '3', type: 'twitter', name: '@lifeops', connected: true, lastSync: new Date().toISOString(), health: 'healthy' },
    { id: '4', type: 'linkedin', name: 'LifeOps Page', connected: false, health: 'error' },
    { id: '5', type: 'newsletter', name: 'Weekly Digest', connected: true, lastSync: new Date().toISOString(), health: 'healthy' },
  ],
  performance: [
    { id: '1', title: 'AI workflows intro', platform: 'WordPress', publishedAt: new Date().toISOString(), impressions: 1250, engagement: 89, clicks: 42, feedback: 'Strong opening; consider adding CTA' },
    { id: '2', title: 'Agent patterns thread', platform: 'Twitter/X', publishedAt: new Date().toISOString(), impressions: 3200, engagement: 156, clicks: 78, feedback: 'Good thread structure' },
  ],
  metrics: { drafts: 5, scheduled: 12, ideaInbox: 8, published: 24 },
}

export async function fetchModuleDashboardContent(): Promise<ModuleDashboardContentPayload> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<ModuleDashboardContentPayload>(
      'module-dashboard-content',
      { method: 'POST' }
    )
    if (!error && data) return data
  }
  const today = new Date()
  const slots: ModuleDashboardContentPayload['calendarSlots'] = []
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    slots.push({ id: `slot-${i}-am`, date: dateStr, time: '09:00', status: i === 2 ? 'scheduled' : 'empty', contentId: i === 2 ? '1' : undefined, title: i === 2 ? 'AI workflows post' : undefined, platform: i === 2 ? 'wordpress' : undefined })
    slots.push({ id: `slot-${i}-pm`, date: dateStr, time: '14:00', status: i === 5 ? 'scheduled' : 'empty', contentId: i === 5 ? '2' : undefined, title: i === 5 ? 'Multi-agent patterns' : undefined, platform: i === 5 ? 'linkedin' : undefined })
  }
  return { ...MOCK_PAYLOAD, calendarSlots: slots }
}

export async function scheduleContentToSlot(slotId: string, contentId: string): Promise<{ success: boolean }> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<{ success: boolean }>('module-dashboard-content', {
      body: { action: 'schedule', slotId, contentId },
    })
    if (!error && data?.success) return { success: true }
  }
  return { success: true }
}
