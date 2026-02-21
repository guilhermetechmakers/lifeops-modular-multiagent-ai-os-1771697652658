import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

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
        .from('settings_preferences')
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
          title: 'Settings & Preferences',
          status: 'active',
          notification_rules: {
            email: true,
            inApp: true,
            webhook: false,
            eventFilters: [],
          },
          automation_defaults: {},
          data_retention: { runHistoryDays: 90, exportEnabled: true },
          developer_settings: {
            webhookEndpoints: [],
            sdkTokens: [],
            sandboxMode: false,
          },
        }
        const { data: inserted, error: insertError } = await supabase
          .from('settings_preferences')
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
      const { notification_rules, automation_defaults, data_retention, developer_settings } = body

      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }
      if (notification_rules !== undefined) updatePayload.notification_rules = notification_rules
      if (automation_defaults !== undefined) updatePayload.automation_defaults = automation_defaults
      if (data_retention !== undefined) updatePayload.data_retention = data_retention
      if (developer_settings !== undefined) updatePayload.developer_settings = developer_settings

      const { data, error } = await supabase
        .from('settings_preferences')
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
