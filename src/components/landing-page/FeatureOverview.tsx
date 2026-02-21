import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import {
  ModuleProjectsIcon,
  ModuleContentIcon,
  ModuleFinanceIcon,
  ModuleHealthIcon,
} from '@/components/design-system'
import { cn } from '@/lib/utils'

const modules = [
  {
    Icon: ModuleProjectsIcon,
    name: 'Projects',
    title: 'Roadmaps & Tickets',
    description: 'Automate project planning, ticket tracking, and CI integration with AI agents.',
    route: '/dashboard/projects',
    gradient: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    Icon: ModuleContentIcon,
    name: 'Content',
    title: 'Pipeline Automation',
    description: 'Streamline content creation, approvals, and distribution workflows.',
    route: '/dashboard/content',
    gradient: 'from-accent/20 to-accent/5',
    iconColor: 'text-accent',
  },
  {
    Icon: ModuleFinanceIcon,
    name: 'Finance',
    title: 'Bookkeeping & Forecasting',
    description: 'AI-powered bookkeeping, expense tracking, and financial forecasting.',
    route: '/dashboard/finance',
    gradient: 'from-success/20 to-success/5',
    iconColor: 'text-success',
  },
  {
    Icon: ModuleHealthIcon,
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
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Module Dashboards
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Specialized automation for every domain. Each module has its own AI agents and workflows.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module, i) => (
            <ScrollReveal key={module.name} animation="slide-up" delay={i + 1}>
              <Card
                className={cn(
                  'group overflow-hidden transition-all duration-300',
                  'hover:scale-[1.02] hover:shadow-card-hover hover:border-primary/30'
                )}
              >
              <div className={cn('h-1 bg-gradient-to-r', module.gradient)} />
              <CardContent className="p-6">
                <div className={cn('mb-4 h-12 w-12 rounded-xl bg-card flex items-center justify-center', module.iconColor)}>
                  <module.Icon size="lg" />
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
