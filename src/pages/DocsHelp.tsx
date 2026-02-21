import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
            <Link
              to="/"
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
            >
              LifeOps
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-8 text-center animate-fade-in">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-lg font-semibold mb-2">Failed to load documentation</h2>
            <p className="text-sm text-muted-foreground mb-4">
              There was a problem loading the docs. Please try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/"
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              LifeOps
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                to="/dashboard/overview"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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

      <main className="mx-auto max-w-6xl px-6 py-12 space-y-12">
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
