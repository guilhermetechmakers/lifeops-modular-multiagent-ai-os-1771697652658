/**
 * Email Verification Edge Function
 * Verify OTP, resend with rate limiting, get status.
 * Server-side only - all logic runs here.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

const RESEND_COOLDOWN_SEC = 60
const LINK_EXPIRY_HOURS = 24

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    })

    let userId: string | undefined
    let userEmail: string | undefined
    let isVerified = false
    if (authHeader) {
      const {
        data: { user },
      } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''))
      userId = user?.id
      userEmail = user?.email
      isVerified = user?.email_confirmed_at != null
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const action = (body?.action as string) ?? 'get_status'

    if (action === 'get_status') {
      let lastResendAt: string | null = null
      if (userId) {
        const { data } = await supabaseAdmin
          .from('email_verification')
          .select('last_resend_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        lastResendAt = data?.last_resend_at ?? null
      }

      const now = new Date()
      const canResendAt = lastResendAt
        ? new Date(new Date(lastResendAt).getTime() + RESEND_COOLDOWN_SEC * 1000)
        : now
      const expiresAt = new Date(now.getTime() + LINK_EXPIRY_HOURS * 60 * 60 * 1000)

      return new Response(
        JSON.stringify({
          verified: isVerified,
          expires_at: expiresAt.toISOString(),
          can_resend_at: canResendAt > now ? canResendAt.toISOString() : null,
          email: userEmail,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'verify') {
      const code = String(body?.code ?? '').trim()
      if (!code || code.length !== 6) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid 6-digit code' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)
      const { data, error } = await supabaseAnon.auth.verifyOtp({
        token_hash: code,
        type: 'email',
      })

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (data?.user) {
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: false, error: 'Verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'resend') {
      if (!userId) {
        return new Response(
          JSON.stringify({ success: false, error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: existing } = await supabaseAdmin
        .from('email_verification')
        .select('last_resend_at')
        .eq('user_id', userId)
        .maybeSingle()

      const lastResend = existing?.last_resend_at
        ? new Date(existing.last_resend_at as string)
        : null
      const now = new Date()
      const canResendAt = lastResend
        ? new Date(lastResend.getTime() + RESEND_COOLDOWN_SEC * 1000)
        : now

      if (canResendAt > now) {
        return new Response(
          JSON.stringify({
            success: false,
            can_resend_at: canResendAt.toISOString(),
            error: `Please wait ${Math.ceil((canResendAt.getTime() - now.getTime()) / 1000)} seconds before resending`,
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const supabaseWithAuth = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader! } },
      })
      const { error: resendError } = await supabaseWithAuth.auth.resend({
        type: 'signup',
      })

      if (resendError) {
        return new Response(
          JSON.stringify({ success: false, error: resendError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      await supabaseAdmin.from('email_verification').upsert(
        {
          user_id: userId,
          title: 'Email Verification',
          status: 'active',
          last_resend_at: now.toISOString(),
          updated_at: now.toISOString(),
        },
        { onConflict: 'user_id' }
      )

      const nextCanResend = new Date(now.getTime() + RESEND_COOLDOWN_SEC * 1000)
      return new Response(
        JSON.stringify({
          success: true,
          can_resend_at: nextCanResend.toISOString(),
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
