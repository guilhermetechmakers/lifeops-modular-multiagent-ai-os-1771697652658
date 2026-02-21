import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ErrorMessage } from '@/components/404-not-found/ErrorMessage'
import { SearchBar } from '@/components/404-not-found/SearchBar'
import { ReportLink } from '@/components/404-not-found/ReportLink'
import { LifeOpsLogo } from '@/components/design-system'

const PAGE_TITLE = '404 Not Found — LifeOps'
const PAGE_DESCRIPTION = 'The page you\'re looking for doesn\'t exist. Find your way back with quick navigation and search.'

export default function NotFound404() {
  useEffect(() => {
    document.title = PAGE_TITLE
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', PAGE_DESCRIPTION)
    return () => {
      document.title = 'LifeOps — Modular Multi-Agent AI OS'
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <LifeOpsLogo size="md" variant="gradient" asLink />
          <ReportLink />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 sm:py-24">
        <div className="w-full max-w-2xl space-y-12">
          <ErrorMessage />

          <section
            className="flex flex-col items-center gap-4 animate-fade-in"
            style={{ animationDelay: '200ms' }}
            aria-label="Quick search"
          >
            <h3 className="text-lg font-medium text-foreground">
              Quick search to find content
            </h3>
            <SearchBar className="w-full" />
          </section>
        </div>
      </main>

      {/* Footer hint */}
      <footer className="py-6 text-center">
        <p className="text-sm text-muted-foreground">
          Need help?{' '}
          <Link
            to="/support"
            className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            Contact support
          </Link>
        </p>
      </footer>
    </div>
  )
}
