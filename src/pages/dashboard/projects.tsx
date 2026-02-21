import { FolderKanban, GitBranch, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const tickets = [
  { id: '1', title: 'Fix auth flow', status: 'in-progress', priority: 'high' },
  { id: '2', title: 'Add API docs', status: 'todo', priority: 'medium' },
  { id: '3', title: 'Refactor dashboard', status: 'done', priority: 'low' },
]

export function ProjectsDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground mt-1">
          Developer-centric automation: roadmaps, tickets, CI
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open PRs</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sprint Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Board</CardTitle>
          <CardDescription>Kanban with auto-triage</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="board">
            <TabsList>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="pr">PR & Release</TabsTrigger>
            </TabsList>
            <TabsContent value="board" className="mt-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border p-4">
                  <h3 className="font-medium mb-4">To Do</h3>
                  {tickets.filter((t) => t.status === 'todo').map((t) => (
                    <div
                      key={t.id}
                      className="rounded-lg bg-card p-3 mb-2 border border-border"
                    >
                      <p className="text-sm font-medium">{t.title}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {t.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-border p-4">
                  <h3 className="font-medium mb-4">In Progress</h3>
                  {tickets.filter((t) => t.status === 'in-progress').map((t) => (
                    <div
                      key={t.id}
                      className="rounded-lg bg-card p-3 mb-2 border border-primary/30"
                    >
                      <p className="text-sm font-medium">{t.title}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {t.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-border p-4">
                  <h3 className="font-medium mb-4">Done</h3>
                  {tickets.filter((t) => t.status === 'done').map((t) => (
                    <div
                      key={t.id}
                      className="rounded-lg bg-card p-3 mb-2 border border-border opacity-75"
                    >
                      <p className="text-sm font-medium">{t.title}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {t.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="roadmap" className="mt-4">
              <p className="text-muted-foreground">Roadmap timeline view</p>
            </TabsContent>
            <TabsContent value="pr" className="mt-4">
              <p className="text-muted-foreground">PR & Release pane</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
