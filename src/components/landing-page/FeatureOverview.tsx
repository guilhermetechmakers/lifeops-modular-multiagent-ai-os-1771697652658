import { Link } from 'react-router-dom'
import { FolderKanban, FileText, Wallet, Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const modules = [
  {
    icon: FolderKanban,
    name: 'Projects',
    title: 'Roadmaps & Tickets',
    description: 'Automate project planning, ticket tracking, and CI integration with AI agents.',
    route: '/dashboard/projects',
    gradient: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    icon: FileText,
    name: 'Content',
    title: 'Pipeline Automation',
    description: 'Streamline content creation, approvals, and distribution workflows.',
    route: '/dashboard/content',
    gradient: 'from-accent/20 to-accent/5',
    iconColor: 'text-accent',
  },
  {
    icon: Wallet,
    name: 'Finance',
    title: 'Bookkeeping & Forecasting',
    description: 'AI-powered bookkeeping, expense tracking, and financial forecasting.',
    route: '/dashboard/finance',
    gradient: 'from-success/20 to-success/5',
    iconColor: 'text-success',
  },
  {
    icon: Heart,
    name: 'Health',
    title: 'Habits & Training',
    description: 'Build habits, track training plans, and optimize your wellness journey.',
    route: '/dashboard/health',
    gradient: 'from-primary/15 to-accent/10',
    iconColor: 'text-primary',
  },
]

export function FeatureOverview() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Module Dashboards
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Specialized automation for every domain. Each module has its own AI agents and workflows.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module, i) => (
            <Card
              key={module.name}
              className={cn(
                'group overflow-hidden transition-all duration-300',
                'hover:scale-[1.02] hover:shadow-card-hover hover:border-primary/30'
              )}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={cn('h-1 bg-gradient-to-r', module.gradient)} />
              <CardContent className="p-6">
                <div className={cn('mb-4 h-12 w-12 rounded-xl bg-card flex items-center justify-center', module.iconColor)}>
                  <module.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{module.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                <Link to={module.route}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 p-0 h-auto font-medium text-primary hover:bg-transparent group-hover:translate-x-1 transition-transform"
                  >
                    Explore {module.name}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
