import { Link } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { cn } from '@/lib/utils'

const tiers = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'For individuals and small teams',
    features: ['Up to 3 agents', '5 cronjobs', 'Basic approvals', 'Community support'],
    cta: 'Try Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'For growing teams',
    features: ['Unlimited agents', 'Unlimited cronjobs', 'Advanced approvals', 'Priority support', 'Custom integrations'],
    cta: 'Start Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: ['Everything in Pro', 'SSO & SAML', 'Dedicated support', 'SLA guarantee', 'On-premise option'],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export function PricingTeaser() {
  return (
    <section className="py-24 px-6 bg-card/30" aria-labelledby="pricing-heading">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-16">
            <h2 id="pricing-heading" className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <ScrollReveal key={tier.name} animation="slide-up" delay={i + 1}>
            <Card
              key={tier.name}
              className={cn(
                'overflow-hidden transition-all duration-300',
                tier.highlighted
                  ? 'border-2 border-primary shadow-lg shadow-primary/10 scale-[1.02]'
                  : 'hover:scale-[1.02] hover:shadow-card-hover hover:border-primary/30'
              )}
            >
              {tier.highlighted && (
                <div className="h-1 bg-gradient-to-r from-primary to-accent" />
              )}
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={tier.name === 'Enterprise' ? '/signup?demo=1' : '/signup'}>
                  <Button
                    className={cn(
                      'w-full gap-2',
                      tier.highlighted && 'shadow-lg shadow-primary/20'
                    )}
                    variant={tier.highlighted ? 'default' : 'outline'}
                    aria-label={
                      tier.name === 'Enterprise'
                        ? `Contact sales for ${tier.name} plan`
                        : `${tier.cta} - ${tier.name} plan`
                    }
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="slide-up" delay={1}>
        <div className="mt-12 text-center">
          <Link to="/pricing">
            <Button
              variant="link"
              className="text-primary gap-2"
              aria-label="View full pricing details and plans"
            >
              View full pricing details
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </Link>
        </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
