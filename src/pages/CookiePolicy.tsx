import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LifeOpsLogo } from '@/components/design-system'
import { CookieConsentBanner } from '@/components/landing-page/CookieConsentBanner'
import { ArrowLeft, Cookie, Shield, BarChart3, Megaphone, Settings2 } from 'lucide-react'

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
          description: 'Required for the website to function. These include authentication, security, and load-balancing cookies. They cannot be disabled.',
          icon: Shield,
        },
        {
          title: 'Analytics Cookies',
          description: 'Help us understand how visitors interact with our site. We use these to improve performance, fix bugs, and optimize the user experience. Data is aggregated and anonymized.',
          icon: BarChart3,
        },
        {
          title: 'Marketing Cookies',
          description: 'Used to deliver relevant advertisements and measure campaign effectiveness. These may be set by our advertising partners.',
          icon: Megaphone,
        },
        {
          title: 'Preference Cookies',
          description: 'Remember your settings, language, and other preferences across sessions to provide a personalized experience.',
          icon: Settings2,
        },
      ],
    },
    {
      id: 'specific-cookies',
      title: 'Cookies We Use',
      content: `Below is a summary of the main cookies used on our platform:`,
      table: [
        { name: 'lifeops_session', category: 'Essential', purpose: 'Maintains your session and authentication state' },
        { name: 'lifeops_cookie_consent', category: 'Essential', purpose: 'Stores your cookie consent preferences' },
        { name: '_ga, _gid', category: 'Analytics', purpose: 'Google Analytics – anonymized usage statistics' },
        { name: 'preference_*', category: 'Preferences', purpose: 'Stores user interface and feature preferences' },
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

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <LifeOpsLogo size="lg" variant="gradient" asLink />
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Cookie className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Cookie Policy
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {COOKIE_POLICY_CONTENT.lastUpdated}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {COOKIE_POLICY_CONTENT.sections.map((section) => (
            <Card
              key={section.id}
              id={section.id}
              className="overflow-hidden border-border bg-card/50 transition-shadow duration-300 hover:shadow-card"
            >
              <CardHeader>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none space-y-4">
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {section.content}
                </p>

                {section.subsections && (
                  <div className="grid gap-4 sm:grid-cols-1 pt-4">
                    {section.subsections.map((sub) => (
                      <div
                        key={sub.title}
                        className="flex gap-4 rounded-xl border border-border bg-muted/20 p-4"
                      >
                        <sub.icon className="h-6 w-6 shrink-0 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{sub.title}</h4>
                          <p className="text-sm text-muted-foreground">{sub.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {section.table && (
                  <div className="overflow-x-auto rounded-lg border border-border mt-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="px-4 py-3 text-left font-semibold text-foreground">Cookie</th>
                          <th className="px-4 py-3 text-left font-semibold text-foreground">Category</th>
                          <th className="px-4 py-3 text-left font-semibold text-foreground">Purpose</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.map((row) => (
                          <tr key={row.name} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{row.name}</td>
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

        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="font-semibold text-foreground mb-2">Manage your cookie preferences</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You can update your consent choices at any time. Clear your stored consent to see the cookie banner again.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              try {
                localStorage.removeItem('lifeops_cookie_consent')
                window.location.reload()
              } catch {
                // Ignore
              }
            }}
          >
            Reset and show consent banner
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link to="/privacy">
            <Button variant="ghost" size="sm">Privacy Policy</Button>
          </Link>
          <Link to="/terms">
            <Button variant="ghost" size="sm">Terms of Service</Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">Back to Home</Button>
          </Link>
        </div>
      </main>

      <CookieConsentBanner />
    </div>
  )
}
