import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LegalProps {
  title: string
  content: string
}

export function Legal({ title, content }: LegalProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link to="/" className="text-primary hover:underline text-sm mb-8 inline-block">
          ← Back to Home
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: February 2025</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
