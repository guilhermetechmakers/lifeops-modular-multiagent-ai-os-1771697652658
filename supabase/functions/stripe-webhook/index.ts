import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const parts = signature.split(',')
  const timestampPart = parts.find((p) => p.startsWith('t='))
  const sigPart = parts.find((p) => p.startsWith('v1='))
  if (!timestampPart || !sigPart) return false
  const timestamp = timestampPart.slice(2)
  const expectedSig = sigPart.slice(3)
  const signedPayload = `${timestamp}.${payload}`
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sigBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(signedPayload)
  )
  const sigArray = new Uint8Array(sigBuffer)
  const hexSig = Array.from(sigArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return hexSig === expectedSig
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const rawBody = await req.text()
    const signature = req.headers.get('stripe-signature') ?? ''
    if (!stripeWebhookSecret || !verifyStripeSignature(rawBody, signature, stripeWebhookSecret)) {
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const event = JSON.parse(rawBody) as {
      type: string
      data?: { object?: Record<string, unknown> }
    }
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const obj = event.data?.object as Record<string, unknown> | undefined

    if (event.type === 'checkout.session.completed') {
      const session = obj as { customer?: string; metadata?: { user_id?: string } }
      const customerId = session.customer as string | undefined
      const userId = session.metadata?.user_id as string | undefined
      if (customerId && userId) {
        const { data: existing } = await supabase
          .from('organization_team_settings')
          .select('billing')
          .eq('user_id', userId)
          .single()
        const existingBilling = (existing?.billing as Record<string, unknown>) ?? {}
        await supabase
          .from('organization_team_settings')
          .upsert(
            {
              user_id: userId,
              title: 'Organization & Team Settings',
              status: 'active',
              billing: { ...existingBilling, stripeCustomerId: customerId, plan: 'Pro', planId: 'pro', status: 'active' },
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          )
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const sub = obj as { customer?: string; status?: string }
      const customerId = sub.customer as string | undefined
      if (!customerId) return new Response(JSON.stringify({ received: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      const { data: allRows } = await supabase.from('organization_team_settings').select('user_id, billing')
      const rows = Array.isArray(allRows) ? allRows : allRows ? [allRows] : []
      const row = rows.find((r) => (r?.billing as Record<string, unknown>)?.stripeCustomerId === customerId)
      if (row) {
        const billing = (row.billing as Record<string, unknown>) ?? {}
        const status = sub.status === 'active' ? 'active' : sub.status === 'past_due' ? 'past_due' : 'canceled'
        await supabase
          .from('organization_team_settings')
          .update({
            billing: { ...billing, status },
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', row.user_id)
      }
    }

    if (event.type === 'invoice.paid' || event.type === 'invoice.payment_failed') {
      const invoice = obj as { customer?: string; status?: string }
      const customerId = invoice.customer as string | undefined
      if (customerId) {
        const { data: allRows } = await supabase.from('organization_team_settings').select('user_id, billing')
        const rows = Array.isArray(allRows) ? allRows : allRows ? [allRows] : []
        const row = rows.find((r) => (r?.billing as Record<string, unknown>)?.stripeCustomerId === customerId)
        if (row) {
          const billing = (row.billing as Record<string, unknown>) ?? {}
          const invoices = (billing.invoices as Array<{ id: string; date: string; amount: number; currency: string; status: string }>) ?? []
          const invId = (invoice as { id?: string }).id
          const invAmount = (invoice as { amount_paid?: number; amount_due?: number }).amount_paid ?? (invoice as { amount_paid?: number; amount_due?: number }).amount_due ?? 0
          const invStatus = invoice.status === 'paid' ? 'paid' : 'failed'
          const newInv = {
            id: invId ?? crypto.randomUUID(),
            date: new Date().toISOString().slice(0, 10),
            amount: invAmount / 100,
            currency: 'usd',
            status: invStatus,
          }
          const updatedInvoices = [...invoices.filter((i) => i.id !== invId), newInv].slice(-12)
          await supabase
            .from('organization_team_settings')
            .update({
              billing: { ...billing, invoices: updatedInvoices },
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', row.user_id)
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Internal server error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
