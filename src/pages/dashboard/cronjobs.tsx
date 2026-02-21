import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search } from 'lucide-react'

const cronjobs = [
  { id: '1', name: 'PR Triage', schedule: '0 2 * * *', nextRun: '2:00 AM', lastOutcome: 'success' },
  { id: '2', name: 'Weekly Digest', schedule: '0 9 * * 1', nextRun: 'Mon 9:00 AM', lastOutcome: 'success' },
  { id: '3', name: 'Monthly Close', schedule: '0 0 1 * *', nextRun: '1st 12:00 AM', lastOutcome: 'failed' },
]

export function CronjobsManager() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setCreateOpen(true)
      const next = new URLSearchParams(searchParams)
      next.delete('create')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cronjobs Manager</h1>
          <p className="text-muted-foreground mt-1">
            CRUD and visualize Cronjobs as first-class objects
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Create Cronjob
        </Button>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Cronjob</DialogTitle>
            <DialogDescription>
              Create a scheduled or event-driven multi-agent workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cronjob-name">Name</Label>
              <Input id="cronjob-name" placeholder="e.g. PR Triage" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cronjob-schedule">Schedule (cron expression)</Label>
              <Input id="cronjob-schedule" placeholder="e.g. 0 2 * * *" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
