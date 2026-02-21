import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Clock, CheckSquare, FolderKanban, FileText, Wallet, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LifeOpsLogo } from '@/components/design-system'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Bot,
    title: 'Multi-Agent Orchestration',
    description: 'Domain-specific agents negotiate, handoff, and reach consensus with traceable messages.',
  },
  {
    icon: Clock,
    title: 'First-Class Cronjobs',
    description: 'Safe scheduled autonomy with templated payloads, automation levels, and run artifacts.',
  },
  {
    icon: CheckSquare,
    title: 'Human-in-the-Loop',
    description: 'Approval queues with SLA timers, diffs, and reversible actions.',
  },
]

const modules = [
  { icon: FolderKanban, name: 'Projects', desc: 'Roadmaps, tickets, CI' },
  { icon: FileText, name: 'Content', desc: 'Pipeline automation' },
  { icon: Wallet, name: 'Finance', desc: 'Bookkeeping, forecasting' },
  { icon: Heart, name: 'Health', desc: 'Habits, training plans' },
]

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/50" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <LifeOpsLogo size="lg" variant="gradient" asLink />
          <div className="flex items-center gap-4">
            <Link to="/login-/-signup">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/login-/-signup">
              <Button>Try Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 animate-fade-in">
            Your AI-Native
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Operating System
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10 animate-slide-up">
            Automate projects, content, finances, and health through coordinated multi-agent AI.
            Every action is explainable, permissioned, and reversible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/signup">
              <Button size="lg" className="gap-2 text-base px-8 py-6">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="text-base px-8 py-6">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features - Bento grid */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-4">Why LifeOps</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Enterprise-grade orchestration with traceability and safe controls.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={cn(
                  'rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02]',
                  i === 0 && 'lg:col-span-2 lg:row-span-1'
                )}
              >
                <f.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-24 px-6 bg-card/30">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-4">Module Dashboards</h2>
          <p className="text-muted-foreground text-center mb-16">
            Specialized automation for every domain.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((m) => (
              <div
                key={m.name}
                className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-card-hover hover:border-primary/30"
              >
                <m.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-1">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center rounded-2xl border border-border bg-card p-16">
          <h2 className="text-3xl font-bold mb-4">Ready to automate?</h2>
          <p className="text-muted-foreground mb-8">
            Join power users and teams building the future of AI orchestration.
          </p>
          <Link to="/signup">
            <Button size="lg" className="gap-2">
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-muted-foreground text-sm">© LifeOps. All rights reserved.</span>
          <div className="flex gap-8">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
