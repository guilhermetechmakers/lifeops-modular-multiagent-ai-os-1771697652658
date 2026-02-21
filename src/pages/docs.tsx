import { BookOpen, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const sections = [
  { title: 'Getting Started', links: ['Introduction', 'Quick Start', 'Authentication'] },
  { title: 'API Reference', links: ['REST API', 'gRPC', 'Webhooks'] },
  { title: 'Guides', links: ['Creating Agents', 'Cronjobs', 'Approvals'] },
]

export function Docs() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            LifeOps Docs
          </Link>
          <div className="relative mt-6 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search docs..." className="pl-9" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <Card key={s.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {s.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {s.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-muted-foreground hover:text-foreground">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need help?</CardTitle>
            <CardDescription>
              Contact support, changelog & status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Contact Support</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
