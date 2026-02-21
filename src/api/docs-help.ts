import { supabase } from '@/lib/supabase'
import type {
  DocsSearchResult,
  Tutorial,
  ChangelogEntry,
  SystemStatus,
  SupportTicketRequest,
} from '@/types/docs-help'

export interface DocsHelpData {
  docs: DocsSearchResult[]
  tutorials: Tutorial[]
  changelog: ChangelogEntry[]
  status: SystemStatus[]
  user_items: Array<{
    id: string
    user_id: string
    title: string
    description?: string
    status: string
    created_at: string
    updated_at: string
  }>
}

export async function fetchDocsHelp(): Promise<DocsHelpData> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<DocsHelpData>('docs-help', {
      body: { action: 'get' },
    })
    if (!error && data) return data
  }
  return {
    docs: [],
    tutorials: [],
    changelog: [],
    status: [],
    user_items: [],
  }
}

export async function searchDocs(q: string): Promise<{ results: DocsSearchResult[] }> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<{ results: DocsSearchResult[] }>(
      'docs-help',
      { body: { action: 'search', q } }
    )
    if (!error && data) return data
  }
  return { results: [] }
}

export async function fetchTutorials(): Promise<{ tutorials: Tutorial[] }> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<{ tutorials: Tutorial[] }>(
      'docs-help',
      { body: { action: 'tutorials' } }
    )
    if (!error && data) return data
  }
  return { tutorials: [] }
}

export async function fetchChangelog(): Promise<{ changelog: ChangelogEntry[] }> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<{ changelog: ChangelogEntry[] }>(
      'docs-help',
      { body: { action: 'changelog' } }
    )
    if (!error && data) return data
  }
  return { changelog: [] }
}

export async function fetchSystemStatus(): Promise<{ status: SystemStatus[] }> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<{ status: SystemStatus[] }>(
      'docs-help',
      { body: { action: 'status' } }
    )
    if (!error && data) return data
  }
  return { status: [] }
}

export async function submitSupportTicket(
  ticket: SupportTicketRequest
): Promise<{ success: boolean; ticket?: { id: string } }> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<{ success: boolean; ticket?: { id: string } }>(
      'docs-help',
      {
        body: {
          action: 'submit_ticket',
          subject: ticket.subject,
          description: ticket.description,
          priority: ticket.priority,
        },
      }
    )
    if (!error && data) return data
    if (error) throw new Error(error.message)
  }
  throw new Error('Supabase not configured')
}
