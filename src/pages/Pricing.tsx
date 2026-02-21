import { Link } from 'react-router-dom'
import { PricingTeaser } from '@/components/landing-page/PricingTeaser'
import { Button } from '@/components/ui/button'

export function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
          >
            LifeOps
          </Link>
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
