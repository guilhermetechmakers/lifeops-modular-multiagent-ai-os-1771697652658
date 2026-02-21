import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

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
