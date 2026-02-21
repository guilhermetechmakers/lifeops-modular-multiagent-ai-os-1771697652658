import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  /** Animation style */
  animation?: 'fade-in' | 'slide-up' | 'slide-up-delay'
  /** Delay index for stagger (0-5) - adds transition delay when entering view */
  delay?: number
}

const DELAY_MS = [0, 75, 100, 150, 200, 300]

export function ScrollReveal({
  children,
  className,
  animation = 'slide-up',
  delay = 0,
}: ScrollRevealProps) {
  const { ref, isInView } = useInView({ once: true })
  const delayMs = DELAY_MS[Math.min(delay, 5)]

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-500 ease-out',
        isInView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8',
        animation === 'fade-in' && (isInView ? 'opacity-100' : 'opacity-0'),
        animation === 'slide-up' && (isInView ? 'translate-y-0' : 'translate-y-8'),
        className
      )}
      style={delayMs > 0 ? { transitionDelay: isInView ? `${delayMs}ms` : '0ms' } : undefined}
    >
      {children}
    </div>
  )
}
