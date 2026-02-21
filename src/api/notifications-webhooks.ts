import { supabase } from '@/lib/supabase'

export interface InAppNotification {
  id: string
  title: string
  message: string | null
  type: string
  entity_id: string | null
  entity_type: string | null
  route_to: string
  read_at: string | null
  created_at: string
}

export interface SendNotificationParams {
  eventType: string
  userId?: string
  channels?: ('in_app' | 'email' | 'webhook')[]
  variables?: Record<string, string>
  webhookUrl?: string
  routeTo?: 'master_dashboard' | 'run_details' | 'approvals_queue'
  entityId?: string
  entityType?: string
}

export async function fetchInAppNotifications(): Promise<InAppNotification[]> {
  if (!supabase) return []
  const { data, error } = await supabase.functions.invoke<{ notifications: InAppNotification[] }>(
    'notifications-webhooks',
    { method: 'GET' }
  )
  if (error || !data?.notifications) return []
  return data.notifications
}

export async function sendNotification(params: SendNotificationParams): Promise<{
  success: boolean
  deliveries?: Array<{ channel: string; status: string; error?: string }>
}> {
  if (!supabase) {
    return { success: false }
  }
  const { data, error } = await supabase.functions.invoke<{
    success: boolean
    deliveries?: Array<{ channel: string; status: string; error?: string }>
  }>('notifications-webhooks', {
    method: 'POST',
    body: params,
  })
  if (error) return { success: false }
  return { success: data?.success ?? false, deliveries: data?.deliveries }
}
