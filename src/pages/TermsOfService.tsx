import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LifeOpsLogo } from '@/components/design-system'
import { TermsText } from '@/components/terms-of-service/TermsText'
import { VersionSelector } from '@/components/terms-of-service/VersionSelector'
import { Download } from '@/components/terms-of-service/Download'
import { useTermsOfService } from '@/hooks/use-terms-of-service'
import { ErrorState } from '@/components/ui/error-state'

export default function TermsOfService() {
  const [selectedVersion, setSelectedVersion] = useState<string | undefined>(undefined)
  const { data, isLoading, isError, refetch } = useTermsOfService(selectedVersion)

  useEffect(() => {
    const prevTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    document.title = 'Terms of Service | LifeOps'
    if (meta) {
      meta.setAttribute(
        'content',
        'LifeOps Terms of Service — Use terms, acceptance flow, versioning, and legal framework.'
      )
    }
    return () => {
      document.title = prevTitle
      if (meta) meta.setAttribute('content', prevDesc)
    }
  }, [])

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version === data?.version.version ? undefined : version)
  }

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
            heading="Failed to load Terms of Service"
            description="There was a problem loading the terms. Please try again."
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
                to="/privacy-policy"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
            </nav>
          </div>
          <div className="mt-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground animate-fade-in">
              Terms of Service
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl animate-slide-up">
              Use terms, acceptance flow, and versioning. By using LifeOps, you agree to these terms.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 space-y-12">
        <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <TermsText
            sections={data?.sections ?? []}
            version={data?.version}
            isLoading={isLoading}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <VersionSelector
            versions={data?.versions ?? []}
            currentVersion={selectedVersion ?? data?.version?.version ?? '1.0.0'}
            onVersionChange={handleVersionChange}
            isLoading={isLoading}
          />
          <Download version={selectedVersion ?? data?.version?.version} />
        </section>
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="mx-auto max-w-4xl px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
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
