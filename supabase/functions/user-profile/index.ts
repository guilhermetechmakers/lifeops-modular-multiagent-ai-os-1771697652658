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

    const jwt = authHeader?.replace('Bearer ', '')
    let userId: string | undefined
    let userEmail: string | undefined
    let userMetadata: Record<string, unknown> | undefined
    if (jwt) {
      const {
        data: { user },
      } = await supabase.auth.getUser(jwt)
      userId = user?.id
      userEmail = user?.email
      userMetadata = user?.user_metadata
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
        .from('user_profile')
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
        const defaultProfile = {
          user_id: userId,
          title: 'User Profile',
          status: 'active',
          profile_info: {
            name: (userMetadata?.full_name as string) ?? (userMetadata?.name as string) ?? 'User',
            email: userEmail ?? '',
            avatar_url: userMetadata?.avatar_url as string | undefined,
            timezone: 'UTC',
            language: 'en',
          },
          connections: [],
          api_keys: [],
          agent_presets: { default_behavior: 'helpful', memory_scope: 'project', temperature: 0.7 },
          security_settings: { two_fa_enabled: false, sessions: [] },
        }
        const { data: inserted, error: insertError } = await supabase
          .from('user_profile')
          .insert(defaultProfile)
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
      const { profile_info, connections, api_keys, agent_presets, security_settings } = body

      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }
      if (profile_info !== undefined) updatePayload.profile_info = profile_info
      if (connections !== undefined) updatePayload.connections = connections
      if (api_keys !== undefined) updatePayload.api_keys = api_keys
      if (agent_presets !== undefined) updatePayload.agent_presets = agent_presets
      if (security_settings !== undefined) updatePayload.security_settings = security_settings

      const { data, error } = await supabase
        .from('user_profile')
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

    if (action === 'create_api_key') {
      const { name, scope } = body
      const prefix = 'lops_' + crypto.randomUUID().slice(0, 8)
      const newKey = {
        id: crypto.randomUUID(),
        name: name ?? 'New API Key',
        prefix,
        scope: Array.isArray(scope) ? scope : ['read'],
        created_at: new Date().toISOString(),
        usage_count: 0,
      }

      const { data: existing } = await supabase
        .from('user_profile')
        .select('api_keys')
        .eq('user_id', userId)
        .single()

      const keys = (existing?.api_keys ?? []) as unknown[]
      keys.push(newKey)

      const { data, error } = await supabase
        .from('user_profile')
        .upsert(
          { user_id: userId, api_keys: keys, updated_at: new Date().toISOString() },
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

      return new Response(
        JSON.stringify({ ...data, _new_key_preview: prefix + '••••••••••••' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'revoke_api_key') {
      const { key_id } = body
      if (!key_id) {
        return new Response(
          JSON.stringify({ error: 'key_id required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: existing } = await supabase
        .from('user_profile')
        .select('api_keys')
        .eq('user_id', userId)
        .single()

      const keys = ((existing?.api_keys ?? []) as { id: string }[]).filter((k) => k.id !== key_id)

      const { data, error } = await supabase
        .from('user_profile')
        .upsert(
          { user_id: userId, api_keys: keys, updated_at: new Date().toISOString() },
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

    if (action === 'revoke_connection') {
      const { connection_id } = body
      if (!connection_id) {
        return new Response(
          JSON.stringify({ error: 'connection_id required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: existing } = await supabase
        .from('user_profile')
        .select('connections')
        .eq('user_id', userId)
        .single()

      const connections = ((existing?.connections ?? []) as { id: string }[]).filter(
        (c) => c.id !== connection_id
      )

      const { data, error } = await supabase
        .from('user_profile')
        .upsert(
          { user_id: userId, connections, updated_at: new Date().toISOString() },
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
