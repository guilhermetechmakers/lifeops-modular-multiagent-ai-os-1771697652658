import { Link } from 'react-router-dom'
import { PricingTeaser } from '@/components/landing-page/PricingTeaser'
import { Button } from '@/components/ui/button'
import { LifeOpsLogo } from '@/components/design-system'

export function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <LifeOpsLogo size="lg" variant="gradient" asLink />
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button>Try Free</Button>
            </Link>
          </div>
        </div>
      </nav>
      <PricingTeaser />
    </div>
  )
}
