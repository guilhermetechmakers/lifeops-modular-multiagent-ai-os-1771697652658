import { useState } from 'react'
import { Plus, Search, Bot, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const agents = [
  { id: '1', name: 'PR Triage Agent', domain: 'Projects', status: 'active', connectors: ['GitHub', 'CI'] },
  { id: '2', name: 'Content Outliner', domain: 'Content', status: 'active', connectors: ['CMS'] },
  { id: '3', name: 'Finance Categorizer', domain: 'Finance', status: 'active', connectors: ['Plaid'] },
  { id: '4', name: 'Training Planner', domain: 'Health', status: 'idle', connectors: ['Calendar'] },
]

export function Agents() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agent Directory</h1>
          <p className="text-muted-foreground mt-1">
            Manage system and user agents
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                        <CardDescription>{agent.domain}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View trace</DropdownMenuItem>
                        <DropdownMenuItem>Clone</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1">
                    {agent.connectors.map((c) => (
                      <Badge key={c} variant="secondary" className="text-xs">
                        {c}
                      </Badge>
                    ))}
                  </div>
                  <Badge
                    variant={agent.status === 'active' ? 'success' : 'secondary'}
                    className="mt-2"
                  >
                    {agent.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
