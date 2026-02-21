import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { RotateCcw, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface RollbackControlsProps {
  runId: string
  canRollback?: boolean
  onPreview?: () => Promise<{ preview: { affectedResources: string[]; steps: string[] } }>
  onRollback?: () => Promise<{ success: boolean; message?: string }>
  isLoading?: boolean
}

export function RollbackControls({
  canRollback = false,
  onPreview,
  onRollback,
  isLoading,
}: RollbackControlsProps) {
  const [preview, setPreview] = useState<{ affectedResources: string[]; steps: string[] } | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [rollbackLoading, setRollbackLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handlePreview = async () => {
    if (!onPreview) return
    setPreviewLoading(true)
    try {
      const res = await onPreview()
      setPreview(res.preview)
    } catch {
      toast.error('Failed to load rollback preview')
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleRollback = async () => {
    if (!onRollback) return
    setRollbackLoading(true)
    try {
      const res = await onRollback()
      if (res.success) {
        toast.success(res.message ?? 'Rollback initiated')
        setOpen(false)
      } else {
        toast.error('Rollback failed')
      }
    } catch {
      toast.error('Rollback failed')
    } finally {
      setRollbackLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Rollback Controls
          {canRollback && (
            <span className="text-xs font-normal text-muted-foreground">Reversible</span>
          )}
        </CardTitle>
        <CardDescription>
          Revert button with preflight checks and simulated dry rollback preview
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!canRollback ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 py-8">
            <AlertTriangle className="h-10 w-10 text-destructive mb-2" aria-hidden />
            <p className="text-sm font-medium">Rollback not available</p>
            <p className="text-xs text-muted-foreground mt-1">This run cannot be reverted.</p>
          </div>
        ) : (
          <Dialog
            open={open}
            onOpenChange={(o) => {
              setOpen(o)
              if (o) {
                setPreview(null)
                handlePreview()
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <RotateCcw className="h-4 w-4" />
                Revert
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Rollback preflight</DialogTitle>
                <DialogDescription>
                  Simulated dry rollback preview. Review affected resources before confirming.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {previewLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : preview ? (
                  <>
                    <div>
                      <p className="text-sm font-medium mb-2">Affected resources</p>
                      <ul className="list-inside list-disc text-sm text-muted-foreground space-y-1">
                        {preview.affectedResources.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Steps</p>
                      <ul className="list-inside list-disc text-sm text-muted-foreground space-y-1">
                        {preview.steps.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Loading preview...</p>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRollback}
                  disabled={rollbackLoading || !preview}
                  className="gap-2"
                >
                  {rollbackLoading ? (
                    'Rolling back...'
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Confirm rollback
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
