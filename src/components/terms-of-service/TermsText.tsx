import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { EmptyStateIllustration } from '@/components/design-system/illustrations/EmptyStateIllustration'
import { FileText } from 'lucide-react'
import type { TermsOfServiceSection, TermsVersion } from '@/types/terms-of-service'
import { cn } from '@/lib/utils'

export interface TermsTextProps {
  sections: TermsOfServiceSection[]
  version?: TermsVersion
  isLoading?: boolean
  className?: string
}

export function TermsText({
  sections,
  version,
  isLoading = false,
  className,
}: TermsTextProps) {
  if (isLoading) {
    return (
      <Card
        className={cn(
          'overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300',
          className
        )}
      >
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="mt-2 h-4 w-32" />
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
          'overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 animate-fade-in',
          className
        )}
      >
        <CardContent className="py-12 sm:py-16">
          <EmptyState
            icon={FileText}
            illustration={
              <EmptyStateIllustration variant="content" size="lg" className="opacity-80" />
            }
            heading="No terms content available"
            description="The Terms of Service are being updated. Please check back later or return to the homepage for other resources."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="default" className="transition-all duration-200 hover:scale-[1.02]">
                  <Link to="/">Return to Home</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="transition-all duration-200 hover:scale-[1.02]"
                >
                  <Link to="/privacy-policy">View Privacy Policy</Link>
                </Button>
              </div>
            }
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover',
        className
      )}
    >
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5 text-primary" />
          Terms of Service
        </CardTitle>
        {version && (
          <p className="text-sm text-muted-foreground">
            Version {version.version} · Effective: {version.effectiveDate}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="prose prose-invert max-w-none space-y-8">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 animate-fade-in"
            >
              <h2 className="text-lg font-semibold text-foreground mb-2">
                {section.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
