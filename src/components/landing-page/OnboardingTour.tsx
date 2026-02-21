import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ChevronLeft, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TOUR_STEPS, ONBOARDING_STORAGE_KEY } from '@/lib/onboarding-copy'
import { cn } from '@/lib/utils'

const TOUR_DISMISSED_KEY = 'lifeops_onboarding_tour_dismissed'

interface OnboardingTourProps {
  /** Whether the tour is visible */
  isOpen: boolean
  /** Callback when tour is closed */
  onClose: () => void
}

export function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const step = TOUR_STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === TOUR_STEPS.length - 1

  const completeTour = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
      localStorage.setItem(TOUR_DISMISSED_KEY, 'true')
    } catch {
      // Ignore localStorage errors
    }
    setIsVisible(false)
    onClose()
  }, [onClose])

  const handleNext = useCallback(() => {
    if (isLast) {
      completeTour()
    } else {
      setStepIndex((i) => i + 1)
    }
  }, [isLast, completeTour])

  const handleBack = useCallback(() => {
    if (isFirst) {
      completeTour()
    } else {
      setStepIndex((i) => i - 1)
    }
  }, [isFirst, completeTour])

  const handleSkip = useCallback(() => {
    completeTour()
  }, [completeTour])

  useEffect(() => {
    if (isOpen) {
      queueMicrotask(() => {
        setStepIndex(0)
        setIsVisible(true)
      })
    } else {
      queueMicrotask(() => setIsVisible(false))
    }
  }, [isOpen])

  useEffect(() => {
    if (!isVisible) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') completeTour()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handleBack()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isVisible, completeTour, handleNext, handleBack])

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
      aria-describedby="tour-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleSkip}
        onKeyDown={(e) => e.key === 'Enter' && handleSkip()}
        tabIndex={0}
        role="button"
        aria-label="Close tour"
      />

      {/* Tour card */}
      <div
        className={cn(
          'relative z-10 w-full max-w-md rounded-2xl border border-border bg-card shadow-card-hover',
          'p-6 sm:p-8 animate-slide-up'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleSkip}
          className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Skip tour"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Step indicator */}
        <div className="flex gap-2 mb-6" aria-hidden>
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all duration-300',
                i <= stepIndex ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Step {stepIndex + 1} of {TOUR_STEPS.length}
            </span>
          </div>
          <h2 id="tour-title" className="text-xl font-bold text-foreground mb-2">
            {step.title}
          </h2>
          <p id="tour-description" className="text-muted-foreground text-base leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip tour
          </Button>
          <div className="flex gap-2">
            {!isFirst && (
              <Button variant="outline" onClick={handleBack} className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            {isLast ? (
              <Button asChild className="gap-2 shadow-lg shadow-primary/20">
                <Link to="/signup">
                  {step.cta}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button onClick={handleNext} className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface OnboardingTourTriggerProps {
  onClick: () => void
  className?: string
}

export function OnboardingTourTrigger({ onClick, className }: OnboardingTourTriggerProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn('gap-2', className)}
      aria-label="Take a guided tour of LifeOps"
    >
      <Sparkles className="h-4 w-4" />
      Take a tour
    </Button>
  )
}
