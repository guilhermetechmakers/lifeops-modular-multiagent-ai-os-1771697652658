import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')

async function stripeFetch(
  endpoint: string,
  body: Record<string, string>
): Promise<{ id?: string; url?: string; error?: { message: string } }> {
  if (!stripeSecretKey) {
    return { error: { message: 'Stripe is not configured' } }
  }
  const params = new URLSearchParams(body)
  const res = await fetch(`https://api.stripe.com/v1/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })
  const data = await res.json()
  if (data.error) return { error: data.error }
  return data
}

const DEFAULT_TEAM_ROSTER = {
  members: [],
  totalSeats: 5,
  usedSeats: 0,
  roles: [
    { id: 'admin', name: 'Admin', description: 'Full access to organization settings' },
    { id: 'member', name: 'Member', description: 'Standard member access' },
    { id: 'viewer', name: 'Viewer', description: 'Read-only access' },
  ],
}

const DEFAULT_RBAC = {
  roles: [
    { id: 'admin', name: 'Admin', description: 'Full permissions', permissions: ['*'] },
    { id: 'member', name: 'Member', description: 'Standard permissions', permissions: ['agents:read', 'agents:run', 'cronjobs:read', 'cronjobs:run'] },
    { id: 'viewer', name: 'Viewer', description: 'Read-only', permissions: ['agents:read', 'cronjobs:read'] },
  ],
  agentPermissions: {},
  cronjobPermissions: {},
}

const DEFAULT_BILLING = {
  plan: 'Pro',
  planId: 'pro',
  status: 'active',
  invoices: [],
  paymentMethods: [],
  usageSummary: { agents: 0, cronjobs: 0, apiCalls: 0, storageGb: 0 },
}

const DEFAULT_ENTERPRISE = {
  samlEnabled: false,
  provisioningEnabled: false,
  onPremAgentRunnerEnabled: false,
  dataResidency: 'us',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    })

    let userId: string | undefined
    if (authHeader) {
      const {
        data: { user },
      } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      userId = user?.id
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json().catch(() => ({}))
    const action = (body as { action?: string }).action ?? 'get'

    if (action === 'get') {
      const { data, error } = await supabase
        .from('organization_team_settings')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (!data) {
        const defaultSettings = {
          user_id: userId,
          title: 'Organization & Team Settings',
          status: 'active',
          team_roster: DEFAULT_TEAM_ROSTER,
          rbac_policies: DEFAULT_RBAC,
          billing: DEFAULT_BILLING,
          enterprise: DEFAULT_ENTERPRISE,
        }
        const { data: inserted, error: insertError } = await supabase
          .from('organization_team_settings')
          .insert(defaultSettings)
          .select()
          .single()

        if (insertError) {
          return new Response(
            JSON.stringify({ error: insertError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        return new Response(JSON.stringify(inserted), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'update') {
      const { team_roster, rbac_policies, billing, enterprise } = body

      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }
      if (team_roster !== undefined) updatePayload.team_roster = team_roster
      if (rbac_policies !== undefined) updatePayload.rbac_policies = rbac_policies
      if (billing !== undefined) updatePayload.billing = billing
      if (enterprise !== undefined) updatePayload.enterprise = enterprise

      const { data, error } = await supabase
        .from('organization_team_settings')
        .upsert(
          {
            user_id: userId,
            ...updatePayload,
          },
          { onConflict: 'user_id' }
        )
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'create_billing_portal') {
      const { return_url, customer_id } = body as { return_url?: string; customer_id?: string }
      const baseUrl = req.headers.get('origin') ?? 'https://app.lifeops.io'
      const portalReturnUrl = return_url ?? `${baseUrl}/dashboard/organization-team-settings`
      let stripeCustomerId = customer_id
      if (!stripeCustomerId) {
        const { data: settings } = await supabase
          .from('organization_team_settings')
          .select('billing')
          .eq('user_id', userId)
          .single()
        stripeCustomerId = (settings?.billing as { stripeCustomerId?: string })?.stripeCustomerId
      }
      if (!stripeCustomerId) {
        const { data: userData } = await supabase.auth.admin.getUserById(userId)
        const email = userData?.user?.email ?? `user-${userId}@lifeops.io`
        const custRes = await stripeFetch('customers', {
          email,
          'metadata[user_id]': userId,
        })
        if (custRes.error || !custRes.id) {
          return new Response(
            JSON.stringify({ error: custRes.error?.message ?? 'Failed to create customer' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        stripeCustomerId = custRes.id
        const { data: existing } = await supabase
          .from('organization_team_settings')
          .select('billing')
          .eq('user_id', userId)
          .single()
        const existingBilling = (existing?.billing as Record<string, unknown>) ?? {}
        const mergedBilling = { ...DEFAULT_BILLING, ...existingBilling, stripeCustomerId }
        await supabase
          .from('organization_team_settings')
          .upsert(
            {
              user_id: userId,
              title: 'Organization & Team Settings',
              status: 'active',
              billing: mergedBilling,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          )
      }
      const result = await stripeFetch('billing_portal/sessions', {
        customer: stripeCustomerId,
        return_url: portalReturnUrl,
      })
      if (result.error) {
        return new Response(
          JSON.stringify({ error: result.error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(JSON.stringify({ url: result.url }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'create_checkout_session') {
      const { price_id, success_url, cancel_url } = body as {
        price_id?: string
        success_url?: string
        cancel_url?: string
      }
      const baseUrl = req.headers.get('origin') ?? 'https://app.lifeops.io'
      const sessionBody: Record<string, string> = {
        mode: 'subscription',
        'payment_method_types[0]': 'card',
        success_url: success_url ?? `${baseUrl}/dashboard/organization-team-settings?success=true`,
        cancel_url: cancel_url ?? `${baseUrl}/dashboard/organization-team-settings?canceled=true`,
        'metadata[user_id]': userId,
      }
      if (price_id) {
        sessionBody['line_items[0][price]'] = price_id
        sessionBody['line_items[0][quantity]'] = '1'
      } else {
        sessionBody['line_items[0][price_data][currency]'] = 'usd'
        sessionBody['line_items[0][price_data][product_data][name]'] = 'LifeOps Pro'
        sessionBody['line_items[0][price_data][product_data][description]'] = 'AI-Native OS for projects, content, finance, and health'
        sessionBody['line_items[0][price_data][unit_amount]'] = '2900'
        sessionBody['line_items[0][price_data][recurring][interval]'] = 'month'
        sessionBody['line_items[0][quantity]'] = '1'
      }
      const { data: userData } = await supabase.auth.admin.getUserById(userId)
      const email = userData?.user?.email
      if (email) sessionBody.customer_email = email
      const result = await stripeFetch('checkout/sessions', sessionBody)
      if (result.error) {
        return new Response(
          JSON.stringify({ error: result.error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(JSON.stringify({ sessionId: result.id, url: result.url }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
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
