import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function RunDetails() {
  const { runId } = useParams<{ runId: string }>()
  const navigate = useNavigate()

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/overview')} aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Run Details</h1>
          <p className="text-muted-foreground mt-1">
            Logs, inter-agent message trace, diffs, and reversible actions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Run {runId ?? 'Unknown'}
            <Badge variant="secondary">Running</Badge>
          </CardTitle>
          <CardDescription>Detailed view for this run</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Progress
            </h3>
            <Progress value={65} className="h-2" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Logs
            </h3>
            <pre className="rounded-lg bg-muted/50 p-4 text-sm overflow-auto max-h-48">
              {`[2025-02-21 10:00:00] Run started
[2025-02-21 10:00:01] Processing PR #234...
[2025-02-21 10:00:05] Agent: PR Triage - Analyzing changes
[2025-02-21 10:00:10] Waiting for approval`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
