/**
 * Docs & Help Edge Function
 * Searchable docs, tutorials, support tickets, changelog, and system status.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const DOCS_INDEX: Array<{ id: string; type: 'guide' | 'api' | 'sdk' | 'troubleshooting'; title: string; description: string; href: string; category: string }> = [
  { id: '1', type: 'guide', title: 'Getting Started', description: 'Introduction to LifeOps and core concepts', href: '/docs-help#getting-started', category: 'Guides' },
  { id: '2', type: 'guide', title: 'Quick Start', description: 'Set up your first agent in 5 minutes', href: '/docs-help#quick-start', category: 'Guides' },
  { id: '3', type: 'guide', title: 'Authentication', description: 'SSO, API keys, and session management', href: '/docs-help#authentication', category: 'Guides' },
  { id: '4', type: 'api', title: 'REST API Reference', description: 'Complete REST API documentation', href: '/docs-help#rest-api', category: 'API Reference' },
  { id: '5', type: 'api', title: 'Webhooks', description: 'Configure webhooks for events', href: '/docs-help#webhooks', category: 'API Reference' },
  { id: '6', type: 'sdk', title: 'Agent Development SDK', description: 'Build custom agents with our SDK', href: '/docs-help#agent-sdk', category: 'Agent SDK' },
  { id: '7', type: 'sdk', title: 'SDK Quickstart', description: 'Install and configure the SDK', href: '/docs-help#sdk-quickstart', category: 'Agent SDK' },
  { id: '8', type: 'troubleshooting', title: 'Common Errors', description: 'Resolve frequent issues', href: '/docs-help#common-errors', category: 'Troubleshooting' },
  { id: '9', type: 'troubleshooting', title: 'Debugging Runs', description: 'Inspect logs and trace execution', href: '/docs-help#debugging', category: 'Troubleshooting' },
]

const TUTORIALS: Array<{ id: string; title: string; description: string; category: string; href: string; duration: string }> = [
  { id: 't1', title: 'Daily Digest Cronjob', description: 'Schedule a daily summary of runs and metrics', category: 'cronjob', href: '/docs-help#tutorial-daily-digest', duration: '10 min' },
  { id: 't2', title: 'PR Triage Workflow', description: 'Automate PR review and triage with agents', category: 'workflow', href: '/docs-help#tutorial-pr-triage', duration: '15 min' },
  { id: 't3', title: 'Custom Agent Template', description: 'Create a reusable agent from scratch', category: 'agent', href: '/docs-help#tutorial-custom-agent', duration: '20 min' },
  { id: 't4', title: 'Slack Integration', description: 'Connect LifeOps to Slack for notifications', category: 'integration', href: '/docs-help#tutorial-slack', duration: '8 min' },
]

const CHANGELOG: Array<{ id: string; version: string; date: string; title: string; changes: string[] }> = [
  { id: 'c1', version: '1.2.0', date: '2025-02-21', title: 'Docs & Help Hub', changes: ['New comprehensive documentation hub', 'Searchable docs with guides, API, SDK', 'Tutorials and templates for Cronjobs', 'Support ticket submission', 'Changelog and system status'] },
  { id: 'c2', version: '1.1.0', date: '2025-02-15', title: 'Agent Directory', changes: ['Agent directory with search', 'Create agent wizard', 'Agent presets and templates'] },
  { id: 'c3', version: '1.0.0', date: '2025-02-01', title: 'Initial Release', changes: ['Master dashboard', 'Cronjobs management', 'Basic agent support'] },
]

const SYSTEM_STATUS: Array<{ service: string; status: string; message?: string }> = [
  { service: 'API', status: 'operational' },
  { service: 'Agents', status: 'operational' },
  { service: 'Cronjobs', status: 'operational' },
  { service: 'Connectors', status: 'operational' },
]

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
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      userId = user?.id
    }

    const body = await req.json().catch(() => ({})) as Record<string, unknown>
    const action = (body?.action as string) ?? 'get'

    if (action === 'search') {
      const q = String(body?.q ?? '').trim().toLowerCase()
      const results = q
        ? DOCS_INDEX.filter(
            (d) =>
              d.title.toLowerCase().includes(q) ||
              d.description.toLowerCase().includes(q) ||
              d.category.toLowerCase().includes(q)
          )
        : DOCS_INDEX
      return new Response(JSON.stringify({ results }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'tutorials') {
      return new Response(JSON.stringify({ tutorials: TUTORIALS }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'changelog') {
      return new Response(JSON.stringify({ changelog: CHANGELOG }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'status') {
      return new Response(JSON.stringify({ status: SYSTEM_STATUS }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'submit_ticket') {
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const subject = String(body?.subject ?? '').trim()
      const description = String(body?.description ?? '').trim()
      const priority = (body?.priority as string) ?? 'medium'
      if (!subject || !description) {
        return new Response(
          JSON.stringify({ error: 'Subject and description are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const { data, error } = await supabase
        .from('docs_help')
        .insert({
          user_id: userId,
          title: `[${priority}] ${subject}`,
          description,
          status: 'open',
        })
        .select()
        .single()
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(JSON.stringify({ success: true, ticket: data }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'get' || !action) {
      const { data, error } = await supabase
        .from('docs_help')
        .select('*')
        .eq('user_id', userId ?? '')
        .order('created_at', { ascending: false })
      const items = error ? [] : (data ?? [])
      return new Response(
        JSON.stringify({
          docs: DOCS_INDEX,
          tutorials: TUTORIALS,
          changelog: CHANGELOG,
          status: SYSTEM_STATUS,
          user_items: userId ? items : [],
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Unknown action' }),
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
