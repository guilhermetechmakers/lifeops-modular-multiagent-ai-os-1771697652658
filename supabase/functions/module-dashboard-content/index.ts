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

    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {}
    const { action, slotId, contentId } = (body || {}) as { action?: string; slotId?: string; contentId?: string }
    if (action === 'schedule' && slotId && contentId) {
      return new Response(
        JSON.stringify({ success: true, slotId, contentId }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'GET' || req.method === 'POST') {
      const ideas = [
        {
          id: '1',
          title: 'AI-powered content workflows',
          outline: '1. Intro to automation\n2. Use cases\n3. Implementation guide',
          priorityScore: 92,
          status: 'outlined' as const,
          createdAt: new Date().toISOString(),
          agentSuggested: true,
        },
        {
          id: '2',
          title: 'Multi-agent collaboration patterns',
          outline: '1. Agent roles\n2. Handoff protocols\n3. Best practices',
          priorityScore: 88,
          status: 'new' as const,
          createdAt: new Date().toISOString(),
          agentSuggested: true,
        },
        {
          id: '3',
          title: 'CMS integration deep dive',
          outline: '1. WordPress REST API\n2. Contentful SDK\n3. Sync strategies',
          priorityScore: 85,
          status: 'drafting' as const,
          createdAt: new Date().toISOString(),
          agentSuggested: false,
        },
      ]

      const calendarSlots: Array<{
        id: string
        date: string
        time?: string
        contentId?: string
        title?: string
        platform?: string
        status: string
      }> = []
      const today = new Date()
      for (let i = 0; i < 14; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() + i)
        const dateStr = d.toISOString().split('T')[0]
        calendarSlots.push({
          id: `slot-${i}-am`,
          date: dateStr,
          time: '09:00',
          contentId: i === 2 ? '1' : undefined,
          title: i === 2 ? 'AI workflows post' : undefined,
          platform: i === 2 ? 'wordpress' : undefined,
          status: i === 2 ? 'scheduled' : 'empty',
        })
        calendarSlots.push({
          id: `slot-${i}-pm`,
          date: dateStr,
          time: '14:00',
          contentId: i === 5 ? '2' : undefined,
          title: i === 5 ? 'Multi-agent patterns' : undefined,
          platform: i === 5 ? 'linkedin' : undefined,
          status: i === 5 ? 'scheduled' : 'empty',
        })
      }

      const drafts = [
        {
          id: '1',
          contentId: '1',
          version: 2,
          content: '<p>AI-powered content workflows enable teams to...</p>',
          seoScore: 78,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          contentId: '2',
          version: 1,
          content: '<p>Multi-agent collaboration patterns...</p>',
          seoScore: 82,
          createdAt: new Date().toISOString(),
        },
      ]

      const connectors = [
        { id: '1', type: 'wordpress' as const, name: 'blog.example.com', connected: true, lastSync: new Date().toISOString(), health: 'healthy' as const },
        { id: '2', type: 'contentful' as const, name: 'Contentful Space', connected: true, lastSync: new Date().toISOString(), health: 'healthy' as const },
        { id: '3', type: 'twitter' as const, name: '@lifeops', connected: true, lastSync: new Date().toISOString(), health: 'healthy' as const },
        { id: '4', type: 'linkedin' as const, name: 'LifeOps Page', connected: false, health: 'error' as const },
        { id: '5', type: 'newsletter' as const, name: 'Weekly Digest', connected: true, lastSync: new Date().toISOString(), health: 'healthy' as const },
      ]

      const performance = [
        { id: '1', title: 'AI workflows intro', platform: 'WordPress', publishedAt: new Date(Date.now() - 86400000 * 3).toISOString(), impressions: 1250, engagement: 89, clicks: 42, feedback: 'Strong opening; consider adding CTA' },
        { id: '2', title: 'Agent patterns thread', platform: 'Twitter/X', publishedAt: new Date(Date.now() - 86400000 * 1).toISOString(), impressions: 3200, engagement: 156, clicks: 78, feedback: 'Good thread structure; expand on handoffs' },
      ]

      const payload = {
        ideas,
        calendarSlots,
        drafts,
        connectors,
        performance,
        metrics: {
          drafts: 5,
          scheduled: 12,
          ideaInbox: 8,
          published: 24,
        },
      }

      return new Response(JSON.stringify(payload), {
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
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
