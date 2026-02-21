import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LifeOpsLogo } from '@/components/design-system'
import { ErrorState } from '@/components/ui/error-state'
import { SearchableDocs } from '@/components/docs-help/SearchableDocs'
import { TutorialsTemplates } from '@/components/docs-help/TutorialsTemplates'
import { SupportContact } from '@/components/docs-help/SupportContact'
import { ChangelogStatus } from '@/components/docs-help/ChangelogStatus'
import { useDocsHelp } from '@/hooks/use-docs-help'

export default function DocsHelp() {
  const { data, isLoading, isError, refetch } = useDocsHelp()

  useEffect(() => {
    const prevTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    document.title = 'Docs & Help | LifeOps'
    if (meta) {
      meta.setAttribute(
        'content',
        'Comprehensive documentation, tutorials, API reference, agent development SDK, and support for LifeOps.'
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
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <LifeOpsLogo size="lg" variant="gradient" asLink />
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <ErrorState
            heading="Failed to load documentation"
            description="There was a problem loading the docs. Please try again."
            onRetry={() => refetch()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <LifeOpsLogo size="lg" variant="gradient" asLink />
            <nav className="flex items-center gap-4" aria-label="Documentation navigation">
              <Link
                to="/dashboard/overview"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Go to Dashboard"
              >
                Dashboard
              </Link>
              <Link
                to="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                aria-label="View Pricing"
              >
                Pricing
              </Link>
            </nav>
          </div>
          <div className="mt-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground animate-fade-in">
              Docs & Help
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl animate-slide-up">
              Comprehensive documentation, tutorials, API docs, and support to help you adopt LifeOps effectively.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 space-y-12" aria-busy={isLoading} aria-live="polite">
        <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <SearchableDocs
            docs={data?.docs ?? []}
            isLoading={isLoading}
          />
        </section>

        <section className="animate-fade-in" style={{ animationDelay: '150ms' }}>
          <TutorialsTemplates
            tutorials={data?.tutorials ?? []}
            isLoading={isLoading}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <SupportContact />
        </section>

        <section className="animate-fade-in" style={{ animationDelay: '250ms' }}>
          <ChangelogStatus
            changelog={data?.changelog ?? []}
            status={data?.status ?? []}
            isLoading={isLoading}
          />
        </section>
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
          <p>Need more help? Contact support@lifeops.io or visit our community forum.</p>
        </div>
      </footer>
    </div>
  )
}
