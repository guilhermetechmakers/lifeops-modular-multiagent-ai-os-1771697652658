import { useNavigate } from 'react-router-dom'
import { FileDown, FileText, ChevronRight, ClipboardList } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import type { FinanceAuditItem } from '@/types/finance-dashboard'
import { cn } from '@/lib/utils'

interface ExportAuditProps {
  auditSnapshot?: FinanceAuditItem[]
  isLoading?: boolean
}

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString()
}

export function ExportAudit({ auditSnapshot = [], isLoading }: ExportAuditProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
            Export & Audit
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Export data and view audit trail
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 transition-all duration-200 hover:scale-[1.02]"
          >
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 transition-all duration-200 hover:scale-[1.02]"
            onClick={() => navigate('/dashboard/audit')}
          >
            <FileText className="h-4 w-4" />
            Full Audit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {auditSnapshot.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <ClipboardList className="h-10 w-10 text-muted-foreground" aria-hidden />
            </div>
            <h3 className="font-semibold text-base">No recent activity</h3>
            <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs">
              Exports and reconciliations will appear here. All actions are auditable.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 transition-all duration-200 hover:scale-[1.02]"
              onClick={() => navigate('/dashboard/audit')}
            >
              View Full Audit Log
            </Button>
          </div>
        ) : (
          <div className="space-y-0 max-h-[280px] overflow-y-auto">
            {auditSnapshot.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate('/dashboard/audit')}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/audit')}
                className={cn(
                  'flex items-center justify-between py-3 px-3 rounded-lg transition-all duration-200',
                  'hover:bg-muted/50 border-b border-border last:border-0 cursor-pointer',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{item.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.entity}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{formatTimestamp(item.timestamp)}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
