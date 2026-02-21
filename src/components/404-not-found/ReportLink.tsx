import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Flag, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useReportBrokenLink } from '@/hooks/use-not-found-report'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface ReportLinkProps {
  className?: string
}

export function ReportLink({ className }: ReportLinkProps) {
  const location = useLocation()
  const { mutate, isPending, isSuccess } = useReportBrokenLink()
  const [hasReported, setHasReported] = useState(false)

  const handleReport = () => {
    const url = window.location.href
    const path = location.pathname

    mutate(
      {
        title: `Broken link: ${path}`,
        description: `User reported broken link at ${url}`,
      },
      {
        onSuccess: () => {
          setHasReported(true)
          toast.success('Thank you! We\'ve received your report.')
        },
        onError: (err) => {
          toast.error(err?.message ?? 'Failed to submit report. Please try again.')
        },
      }
    )
  }

  const isDisabled = isPending || isSuccess || hasReported

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleReport}
      disabled={isDisabled}
      className={cn(
        'gap-2 text-muted-foreground hover:text-foreground transition-all duration-200',
        className
      )}
      aria-label="Report broken link"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : isSuccess || hasReported ? (
        <Check className="h-4 w-4 text-success" aria-hidden />
      ) : (
        <Flag className="h-4 w-4" aria-hidden />
      )}
      {isPending ? 'Submitting...' : isSuccess || hasReported ? 'Reported' : 'Report broken link'}
    </Button>
  )
}
