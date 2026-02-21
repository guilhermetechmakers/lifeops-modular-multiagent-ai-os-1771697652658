import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Database, Download, FileArchive } from 'lucide-react'
import { toast } from 'sonner'
import type { DataRetentionSettings } from '@/types/settings-preferences'
import { useUpdateDataRetention } from '@/hooks/use-settings-preferences'

const RETENTION_OPTIONS = [7, 14, 30, 60, 90, 180, 365]

interface DataRetentionProps {
  retention: DataRetentionSettings
  isLoading?: boolean
}

export function DataRetention({ retention, isLoading }: DataRetentionProps) {
  const updateMutation = useUpdateDataRetention()
  const [localRetention, setLocalRetention] = useState<DataRetentionSettings>(retention ?? {
    runHistoryDays: 90,
    exportEnabled: true,
  })

  const handleDaysChange = (days: number) => {
    const next = { ...localRetention, runHistoryDays: days }
    setLocalRetention(next)
    updateMutation.mutate(next)
  }

  const handleExportToggle = (enabled: boolean) => {
    const next = { ...localRetention, exportEnabled: enabled }
    setLocalRetention(next)
    updateMutation.mutate(next)
  }

  const handleExport = () => {
    toast.success('Export started. You will receive a download link via email.')
    const next = { ...localRetention, lastExportAt: new Date().toISOString() }
    setLocalRetention(next)
    updateMutation.mutate(next)
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Database className="h-5 w-5 text-primary" />
          Data Retention
        </CardTitle>
        <CardDescription>
          Run history retention settings and export data controls
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Run history retention (days)</Label>
          <p className="text-sm text-muted-foreground">
            How long to keep run history before automatic cleanup
          </p>
          <div className="flex flex-wrap gap-2">
            {RETENTION_OPTIONS.map((days) => (
              <Button
                key={days}
                variant={localRetention.runHistoryDays === days ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDaysChange(days)}
                disabled={updateMutation.isPending}
              >
                {days} days
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileArchive className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-base font-medium">Export data</Label>
                <p className="text-sm text-muted-foreground">
                  Enable export of run history and settings
                </p>
              </div>
            </div>
            <Button
              variant={localRetention.exportEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleExportToggle(!localRetention.exportEnabled)}
              disabled={updateMutation.isPending}
            >
              {localRetention.exportEnabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          {localRetention.exportEnabled && (
            <div className="pt-2">
              <Button
                onClick={handleExport}
                disabled={updateMutation.isPending}
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Export data now
              </Button>
              {localRetention.lastExportAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last export: {new Date(localRetention.lastExportAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <Database className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">Data management</p>
          <p className="text-xs text-muted-foreground mt-1">
            Run history older than {localRetention.runHistoryDays} days will be automatically archived
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
