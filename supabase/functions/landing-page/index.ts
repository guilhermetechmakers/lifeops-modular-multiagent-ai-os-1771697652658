/**
 * Landing Page Edge Function
 * CRUD for user landing page data.
 * All request handling, validation, and data access runs server-side.
 */
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
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt)
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const pathParts = url.pathname.replace('/landing-page', '').split('/').filter(Boolean)
    const id = pathParts[0]

    if (req.method === 'GET') {
      if (id) {
        const { data, error } = await supabase
          .from('landing_page')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single()
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: error.code === 'PGRST116' ? 404 : 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      const { data, error } = await supabase
        .from('landing_page')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'POST' && !id) {
      const body = await req.json()
      const { title, description, status } = body as { title?: string; description?: string; status?: string }
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Validation error', message: 'title is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const { data, error } = await supabase
        .from('landing_page')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description?.trim() ?? null,
          status: status ?? 'active',
        })
        .select()
        .single()
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if ((req.method === 'PATCH' || req.method === 'PUT') && id) {
      const body = await req.json()
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (body.title !== undefined) updates.title = String(body.title).trim()
      if (body.description !== undefined) updates.description = body.description ? String(body.description).trim() : null
      if (body.status !== undefined) updates.status = String(body.status)
      const { data, error } = await supabase
        .from('landing_page')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'DELETE' && id) {
      const { error } = await supabase
        .from('landing_page')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
