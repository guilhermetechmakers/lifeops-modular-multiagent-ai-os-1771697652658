import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LifeOpsLogo } from '@/components/design-system'
import { HeroSection } from '@/components/landing-page/HeroSection'
import { FeatureOverview } from '@/components/landing-page/FeatureOverview'
import { CronjobsApprovalsSnapshot } from '@/components/landing-page/CronjobsApprovalsSnapshot'
import { UseCasesTestimonials } from '@/components/landing-page/UseCasesTestimonials'
import { PricingTeaser } from '@/components/landing-page/PricingTeaser'
import { Footer } from '@/components/landing-page/Footer'
import { CookieConsentBanner } from '@/components/landing-page/CookieConsentBanner'
import { OnboardingTour, OnboardingTourTrigger } from '@/components/landing-page/OnboardingTour'
import { LandingPageSkeleton } from '@/components/landing-page/LandingPageSkeleton'
import { ONBOARDING_STORAGE_KEY } from '@/lib/onboarding-copy'

const PAGE_TITLE = 'LifeOps — Your AI-Native Operating System'
const PAGE_DESCRIPTION = 'Automate projects, content, finances, and health through coordinated multi-agent AI. Every action is explainable, permissioned, and reversible.'

const INITIAL_LOAD_MS = 150

export default function LandingPage() {
  const [tourOpen, setTourOpen] = useState(false)
  const [showTourTrigger] = useState(() => {
    try {
      return !localStorage.getItem(ONBOARDING_STORAGE_KEY)
    } catch {
      return true
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  const openTour = useCallback(() => setTourOpen(true), [])
  const closeTour = useCallback(() => setTourOpen(false), [])

  useEffect(() => {
    document.title = PAGE_TITLE
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', PAGE_DESCRIPTION)
    return () => {
      document.title = 'LifeOps — Modular Multi-Agent AI OS'
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), INITIAL_LOAD_MS)
    return () => clearTimeout(t)
  }, [])

  if (isLoading) {
    return <LandingPageSkeleton />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
        id="nav"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <LifeOpsLogo size="lg" variant="gradient" asLink />
          <div className="flex items-center gap-2 sm:gap-4">
            {showTourTrigger && (
              <OnboardingTourTrigger onClick={openTour} className="hidden sm:flex" />
            )}
            <Link to="/login">
              <Button variant="ghost" aria-label="Log in to your account">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                className="hover:scale-[1.02] transition-transform"
                aria-label="Try LifeOps free - no credit card required"
              >
                Try Free
              </Button>
            </Link>
            <Link to="/signup?demo=1">
              <Button
                variant="outline"
                className="hidden sm:inline-flex"
                aria-label="Request a demo of LifeOps"
              >
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <HeroSection id="hero-cta" onTakeTour={showTourTrigger ? openTour : undefined} />
        <div id="features">
          <FeatureOverview />
        </div>
        <div id="cronjobs-snapshot">
          <CronjobsApprovalsSnapshot />
        </div>
        <UseCasesTestimonials />
        <PricingTeaser />
        <Footer />
      </main>

      <OnboardingTour isOpen={tourOpen} onClose={closeTour} />
      <CookieConsentBanner />
    </div>
  )
}
