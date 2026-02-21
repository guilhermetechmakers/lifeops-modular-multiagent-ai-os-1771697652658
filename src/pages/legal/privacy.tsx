import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LifeOpsLogo } from '@/components/design-system'
import { PolicyText } from '@/components/privacy-policy/PolicyText'
import { Contact } from '@/components/privacy-policy/Contact'
import { Download } from '@/components/privacy-policy/Download'
import { usePrivacyPolicy } from '@/hooks/use-privacy-policy'
import { ErrorState } from '@/components/ui/error-state'
import { cn } from '@/lib/utils'

export default function Privacy() {
  const { data, isLoading, isError, refetch } = usePrivacyPolicy()

  useEffect(() => {
    const prevTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    document.title = 'Privacy Policy | LifeOps'
    if (meta) {
      meta.setAttribute(
        'content',
        'LifeOps Privacy Policy — Data collection, storage, processing, user rights, and security measures.'
      )
    }
    return () => {
      document.title = prevTitle
      if (meta) meta.setAttribute('content', prevDesc)
    }
  }, [])

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
            <LifeOpsLogo size="lg" variant="gradient" asLink />
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <ErrorState
            heading="Failed to load privacy policy"
            description="There was a problem loading the policy. Please try again."
            onRetry={() => refetch()}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className={cn(
          'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50',
          'focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background'
        )}
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <LifeOpsLogo size="lg" variant="gradient" asLink />
            <nav
              className="flex flex-wrap items-center gap-3 sm:gap-4"
              aria-label="Legal navigation"
            >
              <Link
                to="/"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Home
              </Link>
              <Link
                to="/dashboard/overview"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="/terms"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms
              </Link>
            </nav>
          </div>
          <div className="mt-6 sm:mt-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground animate-fade-in sm:text-3xl md:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground animate-slide-up text-sm sm:text-base">
              How we collect, store, process, and protect your data. Your rights and our commitment
              to transparency.
            </p>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto max-w-4xl space-y-12 px-4 py-8 sm:px-6 sm:py-12"
        role="main"
      >
        <section
          className="animate-fade-in"
          style={{ animationDelay: '100ms' }}
          aria-label="Privacy policy content"
        >
          <PolicyText
            sections={data?.sections ?? []}
            lastUpdated={data?.lastUpdated}
            isLoading={isLoading}
          />
        </section>

        <section
          className="grid gap-6 animate-fade-in lg:grid-cols-2"
          style={{ animationDelay: '150ms' }}
          aria-label="Contact and export"
        >
          <Contact
            dpo={data?.dpo ?? { name: '', email: '', address: '', responseTime: '' }}
            isLoading={isLoading}
          />
          <Download />
        </section>
      </main>

      <footer className="mt-12 border-t border-border py-6 sm:mt-16 sm:py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to Home
          </Link>
          <div className="flex gap-6">
            <Link
              to="/terms"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
