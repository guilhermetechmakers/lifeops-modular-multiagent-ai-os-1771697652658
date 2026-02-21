import { Layers, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const templates = [
  { id: '1', name: 'Weekly Digest', domain: 'Content', rating: 4.8, uses: 1200 },
  { id: '2', name: 'PR Triage', domain: 'Projects', rating: 4.9, uses: 890 },
  { id: '3', name: 'Monthly Close', domain: 'Finance', rating: 4.6, uses: 450 },
]

export function TemplatesLibrary() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Workflow Template Library</h1>
        <p className="text-muted-foreground mt-1">
          Reusable multi-agent workflow templates
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search templates..." className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <Card key={t.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{t.name}</CardTitle>
                      <CardDescription>{t.domain}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{t.rating}</span>
                    <span className="text-muted-foreground">• {t.uses} uses</span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    Import & Customize
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
