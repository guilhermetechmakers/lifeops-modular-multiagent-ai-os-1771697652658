import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileDown, FileText, Loader2, Check } from 'lucide-react'
import { exportTermsOfServicePdf, exportTermsOfServiceText } from '@/api/terms-of-service'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface DownloadProps {
  version?: string
  className?: string
}

export function Download({ version, className }: DownloadProps) {
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [isExportingText, setIsExportingText] = useState(false)
  const [hasExported, setHasExported] = useState<'pdf' | 'text' | null>(null)

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true)
    setHasExported(null)
    try {
      const { html } = await exportTermsOfServicePdf(version)
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
      setHasExported('pdf')
      toast.success('Print dialog opened — choose "Save as PDF" to export')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to export PDF')
    } finally {
      setIsExportingPdf(false)
    }
  }

  const handleDownloadText = async () => {
    setIsExportingText(true)
    setHasExported(null)
    try {
      const { text } = await exportTermsOfServiceText(version)
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lifeops-terms-of-service-${version ?? 'current'}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setHasExported('text')
      toast.success('Terms of Service downloaded as text')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to export text')
    } finally {
      setIsExportingText(false)
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
          Export Terms
        </CardTitle>
        <CardDescription>
          Download the Terms of Service as PDF or plain text for your records
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf || isExportingText}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
          >
            {isExportingPdf ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : hasExported === 'pdf' ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <FileDown className="h-4 w-4 mr-2" />
            )}
            {isExportingPdf ? 'Preparing...' : 'Download as PDF'}
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadText}
            disabled={isExportingPdf || isExportingText}
            className="transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
          >
            {isExportingText ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : hasExported === 'text' ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            {isExportingText ? 'Preparing...' : 'Download as Text'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          PDF opens print dialog — select &quot;Save as PDF&quot; or &quot;Print to PDF&quot; to export. Text downloads directly.
        </p>
      </CardContent>
    </Card>
  )
}
