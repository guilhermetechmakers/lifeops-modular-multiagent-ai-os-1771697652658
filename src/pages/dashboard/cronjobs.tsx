import { Plus, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const cronjobs = [
  { id: '1', name: 'PR Triage', schedule: '0 2 * * *', nextRun: '2:00 AM', lastOutcome: 'success' },
  { id: '2', name: 'Weekly Digest', schedule: '0 9 * * 1', nextRun: 'Mon 9:00 AM', lastOutcome: 'success' },
  { id: '3', name: 'Monthly Close', schedule: '0 0 1 * *', nextRun: '1st 12:00 AM', lastOutcome: 'failed' },
]

export function CronjobsManager() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cronjobs Manager</h1>
          <p className="text-muted-foreground mt-1">
            CRUD and visualize Cronjobs as first-class objects
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Cronjob
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search cronjobs..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cronjobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{job.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Next: {job.nextRun} • {job.schedule}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={job.lastOutcome === 'success' ? 'success' : 'destructive'}>
                    {job.lastOutcome === 'success' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {job.lastOutcome}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Edit
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
