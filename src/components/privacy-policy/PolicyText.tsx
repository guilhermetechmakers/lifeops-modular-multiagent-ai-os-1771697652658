import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Shield } from 'lucide-react'
import type { PrivacyPolicySection } from '@/types/privacy-policy'
import { cn } from '@/lib/utils'

export interface PolicyTextProps {
  sections: PrivacyPolicySection[]
  lastUpdated?: string
  isLoading?: boolean
  className?: string
}

/**
 * Clear sections for data collection, storage, processing and user rights.
 * Heading hierarchy: h2 (document) -> h3 (sections) for logical accessibility.
 */
export function PolicyText({
  sections,
  lastUpdated = 'February 2025',
  isLoading = false,
  className,
}: PolicyTextProps) {
  if (isLoading) {
    return (
      <Card
        className={cn(
          'overflow-hidden border-border bg-card backdrop-blur-sm transition-all duration-300',
          className
        )}
      >
        <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="mt-2 h-4 w-24" />
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!sections?.length) {
    return (
      <Card
        className={cn(
          'overflow-hidden border-border bg-card backdrop-blur-sm',
          className
        )}
      >
        <CardContent className="py-12">
          <EmptyState
            icon={Shield}
            heading="No policy content available"
            description="The privacy policy is being updated. Please check back later."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'overflow-hidden border-border bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover',
        className
      )}
    >
      <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <h2 className="flex items-center gap-2 text-xl font-semibold leading-none tracking-tight text-foreground">
          <Shield className="h-5 w-5 text-primary" aria-hidden />
          Privacy Policy
        </h2>
        <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="prose prose-invert max-w-none space-y-8">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 animate-fade-in"
            >
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {section.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
