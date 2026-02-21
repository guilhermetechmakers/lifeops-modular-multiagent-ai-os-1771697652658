import { Quote, Package, FileText, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { cn } from '@/lib/utils'

const useCases = [
  {
    vertical: 'Product Teams',
    title: 'Roadmap automation',
    description: 'AI agents sync Jira, create tickets, and update project timelines automatically.',
    icon: Package,
    iconColor: 'text-primary',
  },
  {
    vertical: 'Content Teams',
    title: 'Pipeline automation',
    description: 'Draft, review, approve, and publish content — all with traceable workflows.',
    icon: FileText,
    iconColor: 'text-accent',
  },
  {
    vertical: 'Finance Teams',
    title: 'Bookkeeping & forecasting',
    description: 'Expense categorization, reconciliation, and forecasting with human oversight.',
    icon: TrendingUp,
    iconColor: 'text-success',
  },
]

const testimonials = [
  {
    quote: 'LifeOps transformed how we handle approvals. Every action is traceable and reversible.',
    author: 'Sarah Chen',
    role: 'Product Lead',
    company: 'Tech Corp',
    logo: 'TC',
    logoBg: 'bg-primary/20',
  },
  {
    quote: 'The multi-agent orchestration is a game-changer. Our team can automate workflows safely.',
    author: 'Marcus Johnson',
    role: 'Engineering Director',
    company: 'ScaleUp Inc',
    logo: 'SI',
    logoBg: 'bg-accent/20',
  },
]

export function UseCasesTestimonials() {
  return (
    <section className="py-24 px-6" aria-labelledby="use-cases-heading">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-16">
            <h2 id="use-cases-heading" className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Use Cases & Testimonials
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Verticalized examples and real stories from teams using LifeOps.
            </p>
          </div>
        </ScrollReveal>

        {/* Use cases - verticalized */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {useCases.map((uc, i) => (
            <ScrollReveal key={uc.vertical} animation="slide-up" delay={i + 1}>
            <Card
              key={uc.vertical}
              className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-card-hover hover:border-primary/30"
            >
              <CardContent className="p-8">
                <div
                  className={cn(
                    'mb-4 h-12 w-12 rounded-xl flex items-center justify-center',
                    uc.iconColor
                  )}
                >
                  <uc.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {uc.vertical}
                </span>
                <h3 className="text-lg font-semibold mt-2 mb-2">{uc.title}</h3>
                <p className="text-sm text-muted-foreground">{uc.description}</p>
              </CardContent>
            </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Testimonials with logos */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.author} animation="slide-up" delay={i + 1}>
            <Card
              key={t.author}
              className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-card-hover hover:border-primary/30"
            >
              <CardContent className="p-8">
                <Quote className="h-10 w-10 text-primary/30 mb-4" aria-hidden />
                <blockquote className="text-lg text-foreground mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'h-12 w-12 rounded-xl flex items-center justify-center font-bold text-sm text-foreground shrink-0',
                      t.logoBg
                    )}
                    role="img"
                    aria-label={`${t.company} logo`}
                  >
                    {t.logo}
                  </div>
                  <div>
                    <p className="font-semibold">{t.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.role} at {t.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
