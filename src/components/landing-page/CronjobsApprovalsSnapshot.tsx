import { Clock, CheckSquare, ArrowRight, Play, Pause } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const lifecycleSteps = [
  { icon: Play, label: 'Scheduled', status: 'pending' },
  { icon: ArrowRight, label: 'Running', status: 'active' },
  { icon: Pause, label: 'Awaiting Approval', status: 'pending' },
  { icon: CheckSquare, label: 'Completed', status: 'done' },
]

const approvalItems = [
  { id: 1, title: 'Deploy to production', action: 'Deploy', time: '2h ago' },
  { id: 2, title: 'Publish blog post', action: 'Publish', time: '4h ago' },
  { id: 3, title: 'Approve expense report', action: 'Approve', time: '6h ago' },
]

export function CronjobsApprovalsSnapshot() {
  return (
    <section className="py-24 px-6 bg-card/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Cronjobs & Approvals
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Safe scheduled autonomy with human-in-the-loop. Every action is traceable and reversible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Cronjob lifecycle illustration */}
          <Card className="overflow-hidden border-2 border-border/50">
            <div className="h-1 bg-gradient-to-r from-primary to-accent" />
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Cronjob Lifecycle</h3>
              </div>
              <div className="flex items-center justify-between gap-2">
                {lifecycleSteps.map((step) => (
                  <div key={step.label} className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        'h-12 w-12 rounded-xl flex items-center justify-center mb-2 transition-colors',
                        step.status === 'active'
                          ? 'bg-primary text-primary-foreground'
                          : step.status === 'done'
                          ? 'bg-success/20 text-success'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground text-center">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Templated payloads</strong> → Run artifacts
                  stored → Audit trail for every execution
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Approval queue snapshot */}
          <Card className="overflow-hidden border-2 border-border/50">
            <div className="h-1 bg-gradient-to-r from-accent to-primary" />
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <CheckSquare className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Approval Queue</h3>
              </div>
              <div className="space-y-3">
                {approvalItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-md bg-primary/20 text-primary font-medium">
                        {item.action}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                SLA timers, diffs, and reversible actions — always in control.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
