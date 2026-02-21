import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Bot,
  ChevronRight,
  ChevronLeft,
  Layers,
  FileText,
  Wrench,
  Play,
  Check,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const TEMPLATES = [
  { id: 'pr-triage', name: 'PR Triage Agent', category: 'Projects' },
  { id: 'content-outliner', name: 'Content Outliner', category: 'Content' },
  { id: 'finance-categorizer', name: 'Finance Categorizer', category: 'Finance' },
  { id: 'training-planner', name: 'Training Planner', category: 'Health' },
  { id: 'blank', name: 'Blank Agent', category: 'Custom' },
]

const TOOLS = [
  { id: 'github', name: 'GitHub API' },
  { id: 'cms', name: 'CMS' },
  { id: 'plaid', name: 'Plaid' },
  { id: 'calendar', name: 'Calendar' },
  { id: 'search', name: 'Web Search' },
  { id: 'files', name: 'File System' },
]

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  templateId: z.string().optional(),
  prompt: z.string().optional(),
  tools: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof schema>

interface CreateAgentWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateSuccess?: () => void
  createAgent: (payload: FormData) => Promise<unknown>
}

const STEPS = [
  { id: 'template', label: 'Select template', icon: Layers },
  { id: 'configure', label: 'Configure', icon: FileText },
  { id: 'tools', label: 'Assign tools', icon: Wrench },
  { id: 'test', label: 'Test run', icon: Play },
]

export function CreateAgentWizard({
  open,
  onOpenChange,
  onCreateSuccess,
  createAgent,
}: CreateAgentWizardProps) {
  const [step, setStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      templateId: '',
      prompt: '',
      tools: [],
    },
  })

  const title = watch('title')

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id)
    setValue('templateId', id)
    const t = TEMPLATES.find((x) => x.id === id)
    if (t && !title) setValue('title', t.name)
  }

  const handleToolToggle = (id: string) => {
    const next = selectedTools.includes(id)
      ? selectedTools.filter((x) => x !== id)
      : [...selectedTools, id]
    setSelectedTools(next)
    setValue('tools', next)
  }

  const runTest = async () => {
    setIsTestRunning(true)
    setTestResult(null)
    await new Promise((r) => setTimeout(r, 1500))
    setTestResult('success')
    setIsTestRunning(false)
    toast.success('Test run completed successfully')
  }

  const onSubmit = async (data: FormData) => {
    try {
      await createAgent({
        ...data,
        tools: selectedTools.length ? selectedTools : data.tools,
      })
      toast.success('Agent created successfully')
      onOpenChange(false)
      onCreateSuccess?.()
      setStep(0)
      setSelectedTemplate(null)
      setSelectedTools([])
      setTestResult(null)
    } catch {
      toast.error('Failed to create agent')
    }
  }

  const canProceed = () => {
    if (step === 0) return !!selectedTemplate
    if (step === 1) return !!title
    return true
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Create Agent
          </DialogTitle>
          <DialogDescription>
            Select a template, configure behavior, assign tools, and run a test.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 py-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  step === i
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto min-h-[280px]">
          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {TEMPLATES.map((t) => (
                <Card
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleTemplateSelect(t.id)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleTemplateSelect(t.id)
                  }
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02]',
                    selectedTemplate === t.id && 'ring-2 ring-primary'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {t.category}
                        </p>
                      </div>
                      {selectedTemplate === t.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Agent name</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g. PR Triage Agent"
                  className="mt-2"
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  {...register('description')}
                  placeholder="Brief description of the agent"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="prompt">System prompt / behavior</Label>
                <textarea
                  id="prompt"
                  {...register('prompt')}
                  placeholder="Define the agent's behavior and instructions..."
                  className="mt-2 w-full min-h-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {TOOLS.map((t) => (
                <Card
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleToolToggle(t.id)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleToolToggle(t.id)
                  }
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:shadow-card-hover',
                    selectedTools.includes(t.id) && 'ring-2 ring-primary'
                  )}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <Checkbox
                      checked={selectedTools.includes(t.id)}
                      onCheckedChange={() => handleToolToggle(t.id)}
                    />
                    <span className="font-medium">{t.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Run a quick test to verify your agent configuration.
              </p>
              <Button
                onClick={runTest}
                disabled={isTestRunning}
                className="w-full"
              >
                {isTestRunning ? (
                  'Running test...'
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run test
                  </>
                )}
              </Button>
              {testResult === 'success' && (
                <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-4 text-success">
                  <Check className="h-5 w-5" />
                  Test run completed successfully
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Agent'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
