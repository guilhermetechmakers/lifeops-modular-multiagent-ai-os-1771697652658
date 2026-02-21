import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

type NotificationChannel = 'in_app' | 'email' | 'webhook'
type EventType =
  | 'run_started'
  | 'run_completed'
  | 'run_failed'
  | 'approval_pending'
  | 'approval_resolved'
  | 'agent_conflict'
  | 'connector_expiring'

interface SendNotificationRequest {
  eventType: EventType
  userId: string
  channels?: NotificationChannel[]
  templateId?: string
  variables?: Record<string, string>
  webhookUrl?: string
  routeTo?: 'master_dashboard' | 'run_details' | 'approvals_queue'
  entityId?: string
  entityType?: string
}

function applyTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
  }
  return result
}

async function deliverWebhook(
  url: string,
  payload: Record<string, unknown>,
  retries = 3,
  delayMs = 1000
): Promise<{ success: boolean; error?: string }> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) return { success: true }
      const text = await res.text()
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * attempt))
      }
      return { success: false, error: `HTTP ${res.status}: ${text}` }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * attempt))
      }
      return { success: false, error: msg }
    }
  }
  return { success: false, error: 'Max retries exceeded' }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let userId: string | undefined
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      )
      userId = user?.id
    }

    if (req.method === 'POST') {
      const body = (await req.json()) as SendNotificationRequest
      const {
        eventType,
        userId: bodyUserId,
        channels = ['in_app'],
        variables = {},
        webhookUrl,
        routeTo = 'master_dashboard',
        entityId,
        entityType,
      } = body

      const uid = userId ?? bodyUserId
      if (!uid) {
        return new Response(
          JSON.stringify({ error: 'User ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const title = variables.title ?? `Event: ${eventType}`
      const message = variables.message ?? applyTemplate(
        'Event {{eventType}} for {{entityId}}',
        { ...variables, eventType, entityId: entityId ?? 'unknown' }
      )

      const deliveries: Array<{ channel: string; status: string; error?: string }> = []

      if (channels.includes('in_app')) {
        const { error } = await supabase.from('in_app_notifications').insert({
          user_id: uid,
          title,
          message,
          type: eventType,
          entity_id: entityId,
          entity_type: entityType,
          route_to: routeTo,
        })
        deliveries.push({
          channel: 'in_app',
          status: error ? 'failed' : 'sent',
          error: error?.message,
        })
      }

      if (channels.includes('webhook') && (webhookUrl || body.webhookUrl)) {
        const url = webhookUrl ?? body.webhookUrl
        const { success, error } = await deliverWebhook(url!, {
          eventType,
          userId: uid,
          title,
          message,
          entityId,
          entityType,
          routeTo,
          timestamp: new Date().toISOString(),
        })
        deliveries.push({
          channel: 'webhook',
          status: success ? 'sent' : 'failed',
          error,
        })

        const { error: insertErr } = await supabase.from('notification_deliveries').insert({
          channel: 'webhook',
          recipient: url,
          payload: { eventType, title, message, entityId, entityType },
          status: success ? 'sent' : 'failed',
          retry_count: success ? 0 : 1,
          last_error: error,
          sent_at: success ? new Date().toISOString() : null,
        })
        if (insertErr) {
          if (!success) {
            await supabase.from('notification_deliveries').insert({
              channel: 'webhook',
              recipient: url,
              payload: { eventType, title, message },
              status: 'dead_letter',
              retry_count: 3,
              last_error: error,
            })
          }
        }
      }

      if (channels.includes('email')) {
        deliveries.push({
          channel: 'email',
          status: 'pending',
          error: 'Email channel requires SMTP configuration',
        })
      }

      return new Response(
        JSON.stringify({
          success: true,
          deliveries,
          routeTo,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (req.method === 'GET') {
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: notifications, error } = await supabase
        .from('in_app_notifications')
        .select('id, title, message, type, entity_id, entity_type, route_to, read_at, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ notifications: notifications ?? [] }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Internal server error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
