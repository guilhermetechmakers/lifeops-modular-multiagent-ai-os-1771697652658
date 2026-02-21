/**
 * Privacy Policy Edge Function
 * Serves policy content, DPO contact, and PDF export.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const POLICY_SECTIONS = [
  {
    id: 'data-collection',
    title: 'Data Collection',
    content:
      'LifeOps collects information you provide directly (account details, email, name), usage data (features used, run logs, agent activity), and technical data (IP address, device type, browser). We use this to deliver our services, improve the product, and ensure security.',
  },
  {
    id: 'data-storage',
    title: 'Data Storage',
    content:
      'Your data is stored in secure, geographically distributed data centers. We use encryption at rest and in transit. Retention periods vary by data type: account data is kept while your account is active; run logs and audit trails are retained for up to 90 days unless you request deletion.',
  },
  {
    id: 'data-processing',
    title: 'Data Processing',
    content:
      'We process data to operate LifeOps, run AI agents, execute Cronjobs, and provide analytics. Processing may occur in regions where our infrastructure operates. We do not sell your personal data. Third-party processors (e.g., cloud providers) are bound by data processing agreements.',
  },
  {
    id: 'user-rights',
    title: 'Your Rights',
    content:
      'You have the right to access, correct, delete, or export your data. You can object to processing, restrict processing, or withdraw consent. To exercise these rights, contact our Data Protection Officer. We will respond within 30 days. You may also lodge a complaint with your supervisory authority.',
  },
  {
    id: 'security',
    title: 'Security Measures',
    content:
      'We implement industry-standard security measures including encryption, access controls, regular audits, and monitoring. Access to personal data is limited to authorized personnel. We conduct security assessments and respond promptly to incidents.',
  },
]

const DPO_CONTACT = {
  name: 'Data Protection Officer',
  email: 'dpo@lifeops.io',
  address: 'LifeOps Inc., Privacy Team',
  responseTime: 'Within 30 days',
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

    const body = await req.json().catch(() => ({})) as Record<string, unknown>
    const action = (body?.action as string) ?? 'get'

    if (action === 'get') {
      return new Response(
        JSON.stringify({
          sections: POLICY_SECTIONS,
          dpo: DPO_CONTACT,
          lastUpdated: '2025-02-21',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (action === 'export_pdf') {
      // Return HTML for client-side print-to-PDF (browser Save as PDF)
      const html = generatePrintHtml(POLICY_SECTIONS, DPO_CONTACT)
      return new Response(JSON.stringify({ html }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
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

function generatePrintHtml(
  sections: Array<{ id: string; title: string; content: string }>,
  dpo: { name: string; email: string; address: string; responseTime: string }
): string {
  const sectionsHtml = sections
    .map(
      (s) =>
        `<section class="policy-section">
          <h2>${s.title}</h2>
          <p>${s.content}</p>
        </section>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>LifeOps Privacy Policy</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Inter, system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 48px 24px; color: #18181B; line-height: 1.6; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    .meta { color: #6B7280; font-size: 14px; margin-bottom: 32px; }
    .policy-section { margin-bottom: 24px; }
    .policy-section h2 { font-size: 18px; margin-bottom: 8px; color: #18181B; }
    .policy-section p { margin: 0; color: #374151; }
    .dpo { margin-top: 32px; padding-top: 24px; border-top: 1px solid #E5E7EB; }
    .dpo h2 { font-size: 18px; margin-bottom: 12px; }
    .dpo p { margin: 4px 0; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <h1>LifeOps Privacy Policy</h1>
  <p class="meta">Last updated: February 21, 2025</p>
  ${sectionsHtml}
  <div class="dpo">
    <h2>Data Protection Officer Contact</h2>
    <p><strong>${dpo.name}</strong></p>
    <p>Email: ${dpo.email}</p>
    <p>${dpo.address}</p>
    <p>Response time: ${dpo.responseTime}</p>
  </div>
</body>
</html>`
}
