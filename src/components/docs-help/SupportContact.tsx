import { useState } from 'react'
import { Ticket, MessageCircle, Users, Send, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSubmitSupportTicket } from '@/hooks/use-docs-help'
import { cn } from '@/lib/utils'

const SUPPORT_LINKS = [
  { icon: MessageCircle, label: 'Live Chat', href: '#', description: 'Chat with support' },
  { icon: Users, label: 'Community Forum', href: '#', description: 'Ask the community' },
]

export function SupportContact() {
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const submitMutation = useSubmitSupportTicket()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !description.trim()) return
    submitMutation.mutate({ subject: subject.trim(), description: description.trim(), priority })
    setSubject('')
    setDescription('')
    setPriority('medium')
  }

  return (
    <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-success/5 to-primary/5">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Ticket className="h-5 w-5 text-success" />
          Support Contact
        </CardTitle>
        <CardDescription>
          Ticket submission, live chat, and community forum links
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Brief description of your issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border-border focus-visible:ring-primary/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Provide details about your request..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={cn(
                'flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm',
                'ring-offset-background placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200'
              )}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as 'low' | 'medium' | 'high')}>
              <SelectTrigger id="priority" className="border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 hover:scale-[1.02]"
            disabled={submitMutation.isPending || !subject.trim() || !description.trim()}
          >
            {submitMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Submit Ticket
          </Button>
        </form>

        <div className="border-t border-border pt-6">
          <p className="text-sm font-medium text-muted-foreground mb-3">Other ways to get help</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {SUPPORT_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl border border-border/50 p-4',
                  'transition-all duration-200 hover:border-primary/30 hover:bg-primary/5',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                )}
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <link.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
