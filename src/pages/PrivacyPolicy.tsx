import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LifeOpsLogo } from '@/components/design-system'
import { PolicyText } from '@/components/privacy-policy/PolicyText'
import { Contact } from '@/components/privacy-policy/Contact'
import { Download } from '@/components/privacy-policy/Download'
import { usePrivacyPolicy } from '@/hooks/use-privacy-policy'
import { ErrorState } from '@/components/ui/error-state'

export default function PrivacyPolicy() {
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
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="mx-auto max-w-4xl px-6 py-8">
            <LifeOpsLogo size="lg" variant="gradient" asLink />
          </div>
        </header>
        <div className="mx-auto max-w-4xl px-6 py-16">
          <ErrorState
            heading="Failed to load privacy policy"
            description="There was a problem loading the policy. Please try again."
            onRetry={() => refetch()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <LifeOpsLogo size="lg" variant="gradient" asLink />
            <nav className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                to="/dashboard/overview"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/terms"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
            </nav>
          </div>
          <div className="mt-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground animate-fade-in">
              Privacy Policy
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl animate-slide-up">
              How we collect, store, process, and protect your data. Your rights and our commitment to transparency.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 space-y-12">
        <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <PolicyText
            sections={data?.sections ?? []}
            lastUpdated={data?.lastUpdated}
            isLoading={isLoading}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <Contact dpo={data?.dpo ?? { name: '', email: '', address: '', responseTime: '' }} isLoading={isLoading} />
          <Download />
        </section>
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="mx-auto max-w-4xl px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
          <div className="flex gap-6">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
