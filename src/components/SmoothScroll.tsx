import { useEffect, type ReactNode } from "react"
import Lenis from "lenis"
import { useReducedMotion } from "framer-motion"

/**
 * Wrapper que activa Lenis smooth scroll.
 * Respeta prefers-reduced-motion: si el usuario lo tiene activado,
 * no se inicializa Lenis y se usa el scroll nativo.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })

    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [prefersReduced])

  return <>{children}</>
}
