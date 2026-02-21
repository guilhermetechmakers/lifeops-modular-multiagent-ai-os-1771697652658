import { useState, useCallback } from 'react'
import { Calendar, GripVertical, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { CalendarSlot, ContentIdea } from '@/types/module-dashboard-content'

interface ContentCalendarProps {
  slots: CalendarSlot[]
  ideas?: ContentIdea[]
  onSlotDrop?: (slotId: string, contentId: string) => void
  isLoading?: boolean
}

const PLATFORM_LABELS: Record<string, string> = {
  wordpress: 'WordPress',
  contentful: 'Contentful',
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
  newsletter: 'Newsletter',
}

export function ContentCalendar({ slots, ideas = [], onSlotDrop, isLoading }: ContentCalendarProps) {
  const [draggedItem, setDraggedItem] = useState<{ id: string; title: string } | null>(null)
  const [dragOverSlotId, setDragOverSlotId] = useState<string | null>(null)

  const handleDragStart = useCallback((e: React.DragEvent, idea: ContentIdea) => {
    e.dataTransfer.setData('contentId', idea.id)
    e.dataTransfer.setData('title', idea.title)
    e.dataTransfer.effectAllowed = 'move'
    setDraggedItem({ id: idea.id, title: idea.title })
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null)
    setDragOverSlotId(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, slotId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverSlotId(slotId)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverSlotId(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, slotId: string) => {
      e.preventDefault()
      setDragOverSlotId(null)
      const contentId = e.dataTransfer.getData('contentId')
      if (contentId && onSlotDrop) {
        onSlotDrop(slotId, contentId)
      }
    },
    [onSlotDrop]
  )

  const slotsByDate = slots.reduce<Record<string, CalendarSlot[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = []
    acc[slot.date].push(slot)
    return acc
  }, {})

  const sortedDates = Object.keys(slotsByDate).sort()

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!slots.length) {
    return (
      <Card className="overflow-hidden border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Content Calendar
          </CardTitle>
          <CardDescription>Schedule view with drag-drop publishing slots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <h3 className="font-semibold text-lg">No slots yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Add content ideas and drag them to calendar slots to schedule publishing.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'overflow-hidden border-border/50 transition-all duration-300',
        'hover:shadow-card-hover hover:border-primary/20 animate-fade-in'
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Content Calendar
        </CardTitle>
        <CardDescription>Schedule view with drag-drop publishing slots</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {ideas.length > 0 && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">Drag ideas to schedule</p>
            <div className="flex flex-wrap gap-2">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idea)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-3 py-2 cursor-grab active:cursor-grabbing',
                    'bg-card border-primary/30 transition-all duration-200',
                    'hover:scale-[1.02] hover:shadow-md hover:border-primary/50',
                    draggedItem?.id === idea.id && 'opacity-50'
                  )}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium truncate max-w-[140px]">{idea.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <div className="grid gap-4 min-w-[600px]" style={{ gridTemplateColumns: `repeat(${Math.min(sortedDates.length, 7)}, 1fr)` }}>
            {sortedDates.slice(0, 7).map((date) => (
              <div key={date} className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <div className="space-y-2">
                  {slotsByDate[date]?.map((slot) => (
                    <div
                      key={slot.id}
                      onDragOver={(e) => handleDragOver(e, slot.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, slot.id)}
                      className={cn(
                        'min-h-[80px] rounded-lg border p-3 transition-all duration-200',
                        slot.status === 'scheduled'
                          ? 'bg-gradient-to-br from-primary/10 to-transparent border-primary/30'
                          : 'border-dashed border-border bg-muted/20',
                        dragOverSlotId === slot.id && 'border-primary ring-2 ring-primary/30',
                        'hover:border-primary/30'
                      )}
                    >
                      {slot.status === 'scheduled' ? (
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{slot.title}</p>
                            {slot.platform && (
                              <p className="text-xs text-muted-foreground">{PLATFORM_LABELS[slot.platform] ?? slot.platform}</p>
                            )}
                            {slot.time && <p className="text-xs text-muted-foreground">{slot.time}</p>}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">{slot.time ?? '—'}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
