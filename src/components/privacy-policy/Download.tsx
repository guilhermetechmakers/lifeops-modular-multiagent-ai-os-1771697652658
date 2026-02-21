import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileDown, Loader2, Check } from 'lucide-react'
import { exportPrivacyPolicyPdf } from '@/api/privacy-policy'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface DownloadProps {
  className?: string
}

/**
 * Exportable policy PDF - opens print dialog for Save as PDF.
 */
export function Download({ className }: DownloadProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [hasExported, setHasExported] = useState(false)

  const handleDownload = async () => {
    setIsExporting(true)
    setHasExported(false)
    try {
      const { html } = await exportPrivacyPolicyPdf()
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        toast.error('Please allow pop-ups to download the PDF')
        return
      }
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.onafterprint = () => printWindow.close()
      }, 250)
      setHasExported(true)
      toast.success('Print dialog opened — choose "Save as PDF" to export')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to export PDF')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card
      className={cn(
        'overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover hover:border-primary/20',
        className
      )}
    >
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-accent/5 to-primary/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileDown className="h-5 w-5 text-accent" />
          Export Policy
        </CardTitle>
        <CardDescription>
          Download the privacy policy as a PDF for your records
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Button
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : hasExported ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <FileDown className="h-4 w-4 mr-2" />
          )}
          {isExporting ? 'Preparing...' : 'Download as PDF'}
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          Opens print dialog — select &quot;Save as PDF&quot; or &quot;Print to PDF&quot; to export.
        </p>
      </CardContent>
    </Card>
  )
}
