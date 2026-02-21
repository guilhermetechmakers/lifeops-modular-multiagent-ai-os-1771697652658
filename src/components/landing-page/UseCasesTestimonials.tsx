import { Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const useCases = [
  {
    vertical: 'Product Teams',
    title: 'Roadmap automation',
    description: 'AI agents sync Jira, create tickets, and update project timelines automatically.',
    logo: '📦',
  },
  {
    vertical: 'Content Teams',
    title: 'Pipeline automation',
    description: 'Draft, review, approve, and publish content — all with traceable workflows.',
    logo: '✍️',
  },
  {
    vertical: 'Finance Teams',
    title: 'Bookkeeping & forecasting',
    description: 'Expense categorization, reconciliation, and forecasting with human oversight.',
    logo: '📊',
  },
]

const testimonials = [
  {
    quote: 'LifeOps transformed how we handle approvals. Every action is traceable and reversible.',
    author: 'Sarah Chen',
    role: 'Product Lead',
    company: 'Tech Corp',
  },
  {
    quote: 'The multi-agent orchestration is a game-changer. Our team can automate workflows safely.',
    author: 'Marcus Johnson',
    role: 'Engineering Director',
    company: 'ScaleUp Inc',
  },
]

export function UseCasesTestimonials() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Use Cases & Testimonials
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Verticalized examples and real stories from teams using LifeOps.
          </p>
        </div>

        {/* Use cases - verticalized */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {useCases.map((uc) => (
            <Card
              key={uc.vertical}
              className="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-card-hover hover:border-primary/30"
            >
              <CardContent className="p-8">
                <div className="text-3xl mb-4">{uc.logo}</div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {uc.vertical}
                </span>
                <h3 className="text-lg font-semibold mt-2 mb-2">{uc.title}</h3>
                <p className="text-sm text-muted-foreground">{uc.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <Card
              key={t.author}
              className="overflow-hidden transition-all duration-300 hover:shadow-card-hover"
            >
              <CardContent className="p-8">
                <Quote className="h-10 w-10 text-primary/30 mb-4" />
                <blockquote className="text-lg text-foreground mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                    {t.author.charAt(0)}
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
          ))}
        </div>
      </div>
    </section>
  )
}
