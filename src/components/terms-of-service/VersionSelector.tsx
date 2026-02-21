import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { History } from 'lucide-react'
import type { TermsVersion } from '@/types/terms-of-service'
import { cn } from '@/lib/utils'

export interface VersionSelectorProps {
  versions: TermsVersion[]
  currentVersion: string
  onVersionChange: (version: string) => void
  isLoading?: boolean
  className?: string
}

export function VersionSelector({
  versions,
  currentVersion,
  onVersionChange,
  isLoading = false,
  className,
}: VersionSelectorProps) {
  if (isLoading || !versions?.length) return null

  return (
    <Card
      className={cn(
        'overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover hover:border-primary/20',
        className
      )}
    >
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-accent/5 to-primary/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <History className="h-5 w-5 text-accent" />
          Version History
        </CardTitle>
        <CardDescription>
          View previous versions of the Terms of Service
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Select value={currentVersion} onValueChange={onVersionChange}>
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue placeholder="Select version" />
          </SelectTrigger>
          <SelectContent>
            {versions.map((v) => (
              <SelectItem key={v.version} value={v.version}>
                v{v.version} · {v.effectiveDate}
                {v.changelog ? ` — ${v.changelog}` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
