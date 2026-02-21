import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold mb-2">500</h1>
        <p className="text-muted-foreground mb-8">
          Something went wrong. Our team has been notified.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
}
