import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
          'overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300',
          className
        )}
      >
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-4 w-24 mt-2" />
        </CardHeader>
        <CardContent className="p-6 space-y-6">
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
          'overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm',
          className
        )}
      >
        <CardContent className="py-12 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="font-semibold text-lg">No policy content available</h3>
          <p className="text-sm text-muted-foreground mt-1">
            The privacy policy is being updated. Please check back later.
          </p>
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
          <Shield className="h-5 w-5 text-primary" />
          Privacy Policy
        </CardTitle>
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
