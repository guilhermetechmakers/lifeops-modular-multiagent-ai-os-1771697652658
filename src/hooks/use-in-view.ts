import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  /** Root margin for intersection (e.g. "0px 0px -100px 0px" to trigger 100px before viewport) */
  rootMargin?: string
  /** Threshold 0-1 for how much of element must be visible */
  threshold?: number
  /** Trigger only once (don't reset when scrolling back up) */
  once?: boolean
}

/**
 * Hook to detect when an element enters the viewport.
 * Use with Tailwind animate-* for scroll-triggered animations.
 */
export function useInView(options: UseInViewOptions = {}) {
  const { rootMargin = '0px 0px -50px 0px', threshold = 0.1, once = true } = options
  const ref = useRef<HTMLDivElement | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        } else if (!once) {
          setIsInView(false)
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold, once])

  return { ref, isInView }
}
