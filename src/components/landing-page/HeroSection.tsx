import { Link } from 'react-router-dom'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroIllustration } from '@/components/design-system'

interface HeroSectionProps {
  id?: string
  onTakeTour?: () => void
  /** Optional video URL for hero background. Falls back to animated gradient if not provided. */
  videoSrc?: string
  /** Optional poster image for video (shown before video loads) */
  videoPoster?: string
}

export function HeroSection({ id, onTakeTour, videoSrc, videoPoster }: HeroSectionProps) {
  return (
    <section id={id} className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {videoSrc ? (
          <>
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={videoPoster}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
            <div className="absolute top-1/2 -left-40 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-glow-pulse" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          </>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 animate-fade-in leading-[1.1]">
              Your AI-Native
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent">
                Operating System
              </span>
            </h1>
            <p className="mx-auto lg:mx-0 max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Automate projects, content, finances, and health through coordinated multi-agent AI.
              Every action is explainable, permissioned, and reversible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/signup">
                <Button
                  size="lg"
                  className="gap-2 text-base px-8 py-6 h-auto font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.03] transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary"
                >
                  Try Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/signup?demo=1">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 h-auto gap-2 hover:scale-[1.03] transition-all duration-300 border-2 hover:border-primary/50 hover:bg-primary/5"
                >
                  Request Demo
                  <Play className="h-5 w-5" />
                </Button>
              </Link>
              {onTakeTour && (
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={onTakeTour}
                  className="gap-2 text-base px-8 py-6 h-auto hover:scale-[1.03] transition-all duration-300"
                >
                  <Sparkles className="h-5 w-5" />
                  Take a tour
                </Button>
              )}
            </div>
          </div>

          {/* Hero visual - custom LifeOps illustration */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative max-w-lg mx-auto lg:max-w-none flex justify-center">
              <div className="transition-transform duration-300 hover:scale-[1.02]">
                <HeroIllustration size="lg" className="drop-shadow-2xl" />
              </div>
              {/* Glow ring */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/10 to-accent/10 blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
