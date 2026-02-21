import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LifeOpsLogo } from '@/components/design-system'
import { CookieConsentBanner } from '@/components/landing-page/CookieConsentBanner'
import {
  ArrowLeft,
  Cookie,
  Shield,
  BarChart3,
  Megaphone,
  Settings2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const COOKIE_POLICY_CONTENT = {
  lastUpdated: 'February 2025',
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `LifeOps ("we," "our," or "us") uses cookies and similar technologies to enhance your experience on our platform. This Cookie Policy explains what cookies are, how we use them, and how you can manage your preferences.

By using our website, you consent to our use of cookies in accordance with this policy. You can change your preferences at any time through our cookie consent banner or by visiting this page.`,
    },
    {
      id: 'what-are-cookies',
      title: 'What Are Cookies?',
      content: `Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, understand how you use the site, and improve your experience. Cookies can be "first-party" (set by us) or "third-party" (set by services we use).`,
    },
    {
      id: 'categories',
      title: 'Cookie Categories',
      content: `We use four categories of cookies on our platform:`,
      subsections: [
        {
          title: 'Essential Cookies',
          description:
            'Required for the website to function. These include authentication, security, and load-balancing cookies. They cannot be disabled.',
          icon: Shield,
        },
        {
          title: 'Analytics Cookies',
          description:
            'Help us understand how visitors interact with our site. We use these to improve performance, fix bugs, and optimize the user experience. Data is aggregated and anonymized.',
          icon: BarChart3,
        },
        {
          title: 'Marketing Cookies',
          description:
            'Used to deliver relevant advertisements and measure campaign effectiveness. These may be set by our advertising partners.',
          icon: Megaphone,
        },
        {
          title: 'Preference Cookies',
          description:
            'Remember your settings, language, and other preferences across sessions to provide a personalized experience.',
          icon: Settings2,
        },
      ],
    },
    {
      id: 'specific-cookies',
      title: 'Cookies We Use',
      content: `Below is a summary of the main cookies used on our platform:`,
      table: [
        {
          name: 'lifeops_session',
          category: 'Essential',
          purpose: 'Maintains your session and authentication state',
        },
        {
          name: 'lifeops_cookie_consent',
          category: 'Essential',
          purpose: 'Stores your cookie consent preferences',
        },
        {
          name: '_ga, _gid',
          category: 'Analytics',
          purpose: 'Google Analytics – anonymized usage statistics',
        },
        {
          name: 'preference_*',
          category: 'Preferences',
          purpose: 'Stores user interface and feature preferences',
        },
      ],
    },
    {
      id: 'management',
      title: 'Managing Your Preferences',
      content: `You can manage your cookie preferences at any time:

• **Cookie Banner:** When you first visit our site, a consent banner appears. Use "Accept All," "Reject Non-Essential," or "Customize" to set your preferences.

• **Revisit Preferences:** Return to this Cookie Policy page and use the "Manage preferences" link in the footer to reopen the consent dialog.

• **Browser Settings:** Most browsers allow you to block or delete cookies through their settings. Note that blocking essential cookies may affect site functionality.`,
    },
    {
      id: 'updates',
      title: 'Updates',
      content: `We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes by posting the updated policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.`,
    },
    {
      id: 'contact',
      title: 'Contact',
      content: `If you have questions about our use of cookies or this Cookie Policy, please contact us at privacy@lifeops.io or visit our Support page.`,
    },
  ],
}

function handleResetConsent() {
  try {
    localStorage.removeItem('lifeops_cookie_consent')
    window.location.reload()
  } catch {
    // Ignore storage errors
  }
}

export default function CookiePolicy() {
  useEffect(() => {
    const prevTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    document.title = 'Cookie Policy | LifeOps'
    if (meta) {
      meta.setAttribute(
        'content',
        'LifeOps Cookie Policy — How we use cookies, categories, and how to manage your preferences.'
      )
    }
    return () => {
      document.title = prevTitle
      if (meta) meta.setAttribute('content', prevDesc)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className={cn(
          'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50',
          'focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
        )}
      >
        Skip to main content
      </a>

      <nav
        className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md"
        aria-label="Cookie policy navigation"
      >
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <LifeOpsLogo size="lg" variant="gradient" asLink />
          <Link
            to="/"
            aria-label="Return to home page"
          >
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 transition-all duration-200 hover:scale-[1.02]"
              aria-label="Back to home page"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <main
        id="main-content"
        className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12"
        role="main"
      >
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 sm:h-14 sm:w-14"
              aria-hidden
            >
              <Cookie className="h-6 w-6 text-primary sm:h-7 sm:w-7" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Cookie Policy
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Last updated: {COOKIE_POLICY_CONTENT.lastUpdated}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {COOKIE_POLICY_CONTENT.sections.map((section) => (
            <Card
              key={section.id}
              id={section.id}
              className={cn(
                'overflow-hidden border-border bg-card/50 transition-all duration-300',
                'hover:shadow-card hover:border-primary/10'
              )}
            >
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none space-y-4 pt-0">
                <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {section.content}
                </p>

                {section.subsections && (
                  <div className="grid gap-4 pt-4 sm:grid-cols-1">
                    {section.subsections.map((sub) => (
                      <div
                        key={sub.title}
                        className="flex gap-4 rounded-xl border border-border bg-muted/20 p-4 transition-colors duration-200 hover:bg-muted/30"
                      >
                        <sub.icon
                          className="mt-0.5 h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6"
                          aria-hidden
                        />
                        <div>
                          <h4 className="mb-1 font-semibold text-foreground">{sub.title}</h4>
                          <p className="text-sm text-muted-foreground">{sub.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {section.table && (
                  <div className="mt-4 overflow-x-auto rounded-lg border border-border">
                    <table className="w-full min-w-[320px] text-sm" role="table">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th
                            className="px-4 py-3 text-left font-semibold text-foreground"
                            scope="col"
                          >
                            Cookie
                          </th>
                          <th
                            className="px-4 py-3 text-left font-semibold text-foreground"
                            scope="col"
                          >
                            Category
                          </th>
                          <th
                            className="px-4 py-3 text-left font-semibold text-foreground"
                            scope="col"
                          >
                            Purpose
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.map((row) => (
                          <tr
                            key={row.name}
                            className="border-b border-border last:border-0 transition-colors duration-200 hover:bg-muted/20"
                          >
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                              {row.name}
                            </td>
                            <td className="px-4 py-3 text-foreground">{row.category}</td>
                            <td className="px-4 py-3 text-muted-foreground">{row.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <section
          className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:mt-12 sm:p-6"
          aria-labelledby="manage-preferences-heading"
        >
          <h2
            id="manage-preferences-heading"
            className="mb-2 font-semibold text-foreground sm:mb-4"
          >
            Manage your cookie preferences
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            You can update your consent choices at any time. Clear your stored consent to see the
            cookie banner again.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetConsent}
            className="transition-all duration-200 hover:scale-[1.02]"
            aria-label="Reset cookie consent and show consent banner again"
          >
            Reset and show consent banner
          </Button>
        </section>

        <nav
          className="mt-8 flex flex-wrap gap-3 sm:mt-12 sm:gap-4"
          aria-label="Related legal pages"
        >
          <Link to="/privacy-policy" aria-label="View Privacy Policy">
            <Button
              variant="ghost"
              size="sm"
              className="transition-all duration-200 hover:scale-[1.02]"
              aria-label="Go to Privacy Policy"
            >
              Privacy Policy
            </Button>
          </Link>
          <Link to="/terms" aria-label="View Terms of Service">
            <Button
              variant="ghost"
              size="sm"
              className="transition-all duration-200 hover:scale-[1.02]"
              aria-label="Go to Terms of Service"
            >
              Terms of Service
            </Button>
          </Link>
          <Link to="/" aria-label="Return to home page">
            <Button
              variant="ghost"
              size="sm"
              className="transition-all duration-200 hover:scale-[1.02]"
              aria-label="Back to home page"
            >
              Back to Home
            </Button>
          </Link>
        </nav>
      </main>

      <CookieConsentBanner />
    </div>
  )
}
