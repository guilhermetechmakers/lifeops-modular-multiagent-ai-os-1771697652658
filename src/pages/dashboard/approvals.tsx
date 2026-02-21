import { Check, X, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const approvals = [
  { id: '1', action: 'Categorize 12 transactions', agent: 'Finance Categorizer', sla: '2h' },
  { id: '2', action: 'Merge PR #234', agent: 'PR Triage', sla: '4h' },
]

export function ApprovalsQueue() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Approvals Queue</h1>
        <p className="text-muted-foreground mt-1">
          Human-in-the-loop reviews for pending actions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>
            Review diffs, artifacts, and decide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {approvals.map((a) => (
              <div
                key={a.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium">{a.action}</p>
                  <p className="text-sm text-muted-foreground">{a.agent}</p>
                  <Badge variant="secondary" className="mt-2">
                    <Clock className="h-3 w-3 mr-1" />
                    SLA: {a.sla}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button size="sm">
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
