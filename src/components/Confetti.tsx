import { useCallback, useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"

const COLORS = [
  "#f7a8c4",
  "#a8d8f0",
  "#c9b6f0",
  "#fcd5e2",
  "#d6ecf8",
  "#e7def8",
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  gravity: number
  size: number
  color: string
  rotation: number
  spin: number
  life: number
  decay: number
  shape: "rect" | "circle"
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

/**
 * Canvas de confeti fijo a la pantalla.
 * Expone un ref con la función `burst` para lanzar ráfagas.
 */
export default function Confetti({
  burstRef,
}: {
  burstRef: React.MutableRefObject<((x: number, y: number, count?: number) => void) | null>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)
  const prefersReduced = useReducedMotion()

  const spawnBurst = useCallback(
    (x: number, y: number, count = 80) => {
      if (prefersReduced) return
      for (let i = 0; i < count; i++) {
        const angle = rand(0, Math.PI * 2)
        const speed = rand(3, 9)
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          gravity: 0.18,
          size: rand(5, 10),
          color: COLORS[(Math.random() * COLORS.length) | 0],
          rotation: rand(0, Math.PI * 2),
          spin: rand(-0.2, 0.2),
          life: 1,
          decay: rand(0.008, 0.016),
          shape: Math.random() > 0.5 ? "rect" : "circle",
        })
      }
      if (!rafRef.current) loop()
    },
    [prefersReduced]
  )

  const loop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    particlesRef.current.forEach((p) => {
      p.vy += p.gravity
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.99
      p.rotation += p.spin
      p.life -= p.decay

      ctx.save()
      ctx.globalAlpha = Math.max(p.life, 0)
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.fillStyle = p.color
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    })

    particlesRef.current = particlesRef.current.filter(
      (p) => p.life > 0 && p.y < window.innerHeight + 40
    )

    if (particlesRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(loop)
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      rafRef.current = null
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + "px"
      canvas.style.height = window.innerHeight + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })

    burstRef.current = spawnBurst

    // Confeti de bienvenida sutil
    const welcomeTimer = setTimeout(() => {
      spawnBurst(window.innerWidth * 0.3, -20, 30)
      spawnBurst(window.innerWidth * 0.7, -20, 30)
    }, 600)

    return () => {
      window.removeEventListener("resize", resize)
      clearTimeout(welcomeTimer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [spawnBurst, burstRef])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-5"
    />
  )
}
