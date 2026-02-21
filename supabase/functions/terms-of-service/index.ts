/**
 * Terms of Service Edge Function
 * Serves terms content, versioning, and PDF/text export.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const TERMS_SECTIONS = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content:
      'By accessing or using LifeOps ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. Your continued use of the Service constitutes acceptance of any updates to these Terms. We recommend reviewing this page periodically.',
  },
  {
    id: 'description',
    title: 'Description of Service',
    content:
      'LifeOps is an AI-Native Operating System that helps you manage projects, content, finance, and health through automated workflows, AI agents, Cronjobs, and approval queues. The Service is provided as-is and may be modified, suspended, or discontinued at our discretion. We strive to maintain high availability but do not guarantee uninterrupted access.',
  },
  {
    id: 'account',
    title: 'Account and Registration',
    content:
      'You must provide accurate, complete registration information and keep your account credentials secure. You are responsible for all activity under your account. You must be at least 18 years old (or the age of majority in your jurisdiction) to use the Service. We may suspend or terminate accounts that violate these Terms or for other reasons at our sole discretion.',
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    content:
      'You agree not to use the Service to: (a) violate any applicable law or regulation; (b) infringe intellectual property or other rights of others; (c) distribute malware, spam, or harmful content; (d) attempt to gain unauthorized access to our systems or other users\' accounts; (e) interfere with or disrupt the Service; or (f) use the Service for any illegal or fraudulent purpose. We may monitor usage and take action, including suspension or termination, for violations.',
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content:
      'LifeOps and its licensors retain all rights, title, and interest in the Service, including software, designs, trademarks, and content. You receive a limited, non-exclusive, non-transferable license to use the Service for your internal business or personal use. You retain ownership of content you create using the Service, subject to a license for us to operate and improve the Service.',
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content:
      'Your use of the Service is also governed by our Privacy Policy and Cookie Policy. By using the Service, you consent to our collection, use, and disclosure of information as described in those policies.',
  },
  {
    id: 'termination',
    title: 'Termination',
    content:
      'You may terminate your account at any time through account settings. We may terminate or suspend your access immediately, without prior notice, for breach of these Terms or for any other reason. Upon termination, your right to use the Service ceases. Provisions that by their nature should survive (e.g., intellectual property, disclaimers, indemnification) will survive termination.',
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer of Warranties',
    content:
      'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.',
  },
  {
    id: 'limitation',
    title: 'Limitation of Liability',
    content:
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, LIFEOPS AND ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM.',
  },
  {
    id: 'governing-law',
    title: 'Governing Law and Disputes',
    content:
      'These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Delaware. You waive any right to a jury trial or to participate in a class action.',
  },
  {
    id: 'changes',
    title: 'Changes to Terms',
    content:
      'We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on this page and updating the version and effective date. Continued use of the Service after changes constitutes acceptance. If you do not agree to the new Terms, you must stop using the Service and may terminate your account.',
  },
  {
    id: 'contact',
    title: 'Contact',
    content:
      'For questions about these Terms of Service, please contact us at legal@lifeops.io or visit our Support page at /support.',
  },
]

const TERMS_VERSIONS = [
  { version: '1.0.0', effectiveDate: '2025-02-21', changelog: 'Initial release' },
]

const CURRENT_VERSION = TERMS_VERSIONS[0]!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    })

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const action = (body?.action as string) ?? 'get'
    const versionParam = body?.version as string | undefined

    if (action === 'get') {
      const version = versionParam
        ? TERMS_VERSIONS.find((v) => v.version === versionParam) ?? CURRENT_VERSION
        : CURRENT_VERSION
      return new Response(
        JSON.stringify({
          sections: TERMS_SECTIONS,
          version,
          versions: TERMS_VERSIONS,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (action === 'export_pdf') {
      const version = versionParam
        ? TERMS_VERSIONS.find((v) => v.version === versionParam) ?? CURRENT_VERSION
        : CURRENT_VERSION
      const html = generatePrintHtml(TERMS_SECTIONS, version)
      return new Response(JSON.stringify({ html }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'export_text') {
      const version = versionParam
        ? TERMS_VERSIONS.find((v) => v.version === versionParam) ?? CURRENT_VERSION
        : CURRENT_VERSION
      const text = generatePlainText(TERMS_SECTIONS, version)
      return new Response(JSON.stringify({ text }), {
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
  version: { version: string; effectiveDate: string }
): string {
  const sectionsHtml = sections
    .map(
      (s) =>
        `<section class="terms-section">
          <h2>${s.title}</h2>
          <p>${s.content}</p>
        </section>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>LifeOps Terms of Service</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Inter, system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 48px 24px; color: #18181B; line-height: 1.6; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    .meta { color: #6B7280; font-size: 14px; margin-bottom: 32px; }
    .terms-section { margin-bottom: 24px; }
    .terms-section h2 { font-size: 18px; margin-bottom: 8px; color: #18181B; }
    .terms-section p { margin: 0; color: #374151; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <h1>LifeOps Terms of Service</h1>
  <p class="meta">Version ${version.version} · Effective: ${version.effectiveDate}</p>
  ${sectionsHtml}
</body>
</html>`
}

function generatePlainText(
  sections: Array<{ id: string; title: string; content: string }>,
  version: { version: string; effectiveDate: string }
): string {
  const header = `LifeOps Terms of Service\nVersion ${version.version} · Effective: ${version.effectiveDate}\n\n`
  const body = sections
    .map((s) => `${s.title}\n\n${s.content}\n\n`)
    .join('')
  return header + body
}
