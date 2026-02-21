import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { HeroSection } from '@/components/landing-page/HeroSection'
import { FeatureOverview } from '@/components/landing-page/FeatureOverview'
import { CronjobsApprovalsSnapshot } from '@/components/landing-page/CronjobsApprovalsSnapshot'
import { UseCasesTestimonials } from '@/components/landing-page/UseCasesTestimonials'
import { PricingTeaser } from '@/components/landing-page/PricingTeaser'
import { Footer } from '@/components/landing-page/Footer'

const PAGE_TITLE = 'LifeOps — Your AI-Native Operating System'
const PAGE_DESCRIPTION = 'Automate projects, content, finances, and health through coordinated multi-agent AI. Every action is explainable, permissioned, and reversible.'

export default function LandingPage() {
  useEffect(() => {
    document.title = PAGE_TITLE
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', PAGE_DESCRIPTION)
    return () => {
      document.title = 'LifeOps — Modular Multi-Agent AI OS'
    }
  }, [])
  return (
    <div className="min-h-screen bg-background">
      {/* Fixed nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
        id="nav"
      >
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
              <Button className="hover:scale-[1.02] transition-transform">
                Try Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <HeroSection />
        <div id="features">
          <FeatureOverview />
        </div>
        <CronjobsApprovalsSnapshot />
        <UseCasesTestimonials />
        <PricingTeaser />
        <Footer />
      </main>
    </div>
  )
}
