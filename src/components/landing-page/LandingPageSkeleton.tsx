import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function LandingPageSkeleton() {
  return (
    <div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading landing page">
      {/* Nav skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero skeleton */}
        <section className="relative min-h-[90vh] flex items-center px-6 py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-7xl w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <Skeleton className="h-14 w-full max-w-md mx-auto lg:mx-0" />
                <Skeleton className="h-14 w-64 max-w-sm mx-auto lg:mx-0" />
                <Skeleton className="h-6 w-full max-w-xl mx-auto lg:mx-0" />
                <Skeleton className="h-6 w-full max-w-lg mx-auto lg:mx-0" />
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Skeleton className="h-12 w-40 rounded-lg" />
                  <Skeleton className="h-12 w-36 rounded-lg" />
                </div>
              </div>
              <Skeleton className="h-80 w-full max-w-lg mx-auto rounded-2xl" />
            </div>
          </div>
        </section>

        {/* Features skeleton */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <Skeleton className="h-10 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-1 bg-muted" />
                  <CardContent className="p-6">
                    <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cronjobs & Approvals skeleton */}
        <section className="py-24 px-6 bg-card/30">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <Skeleton className="h-10 w-72 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid lg:grid-cols-2 gap-12">
              <Card>
                <div className="h-1 bg-muted" />
                <CardContent className="p-8">
                  <Skeleton className="h-10 w-48 mb-8" />
                  <div className="flex gap-4 justify-between mb-8">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-12 w-12 rounded-xl" />
                    ))}
                  </div>
                  <Skeleton className="h-16 w-full rounded-lg" />
                </CardContent>
              </Card>
              <Card>
                <div className="h-1 bg-muted" />
                <CardContent className="p-8">
                  <Skeleton className="h-10 w-40 mb-6" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Use cases skeleton */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <Skeleton className="h-10 w-80 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-8">
                    <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="p-8">
                    <Skeleton className="h-10 w-10 rounded mb-4" />
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-12 w-12 rounded-xl" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing skeleton */}
        <section className="py-24 px-6 bg-card/30">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <Skeleton className="h-10 w-72 mx-auto mb-4" />
              <Skeleton className="h-6 w-80 mx-auto" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <div className="h-1 bg-muted" />
                  <CardContent className="p-8">
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-10 w-20 mb-6" />
                    <div className="space-y-3 mb-8">
                      {[1, 2, 3, 4].map((j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                    </div>
                    <Skeleton className="h-11 w-full rounded-lg" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Footer skeleton */}
        <footer className="border-t border-border py-16 px-6">
          <div className="mx-auto max-w-7xl">
            <Skeleton className="h-4 w-48 mb-8" />
          </div>
        </footer>
      </main>
    </div>
  )
}
