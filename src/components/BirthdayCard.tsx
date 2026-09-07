import { useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { PartyPopperIcon, StarIcon, SparkleIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import Confetti from "./Confetti"

const EASE = [0.22, 1, 0.36, 1] as const

export default function BirthdayCard() {
  const prefersReduced = useReducedMotion()
  const burstRef = useRef<((x: number, y: number, count?: number) => void) | null>(null)
  const [showWish, setShowWish] = useState(false)

  const handleCelebrate = () => {
    if (prefersReduced) return
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    burstRef.current?.(cx, cy, 120)
    setTimeout(() => burstRef.current?.(cx - 120, cy + 40, 60), 180)
    setTimeout(() => burstRef.current?.(cx + 120, cy + 40, 60), 360)
  }

  const handleWish = () => {
    setShowWish((v) => !v)
    if (!prefersReduced) {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      burstRef.current?.(cx, cy + 100, 40)
    }
  }

  const year = new Date().getFullYear()

  return (
    <>
      <Confetti burstRef={burstRef} />

      <motion.main
        className="relative z-2 w-full max-w-[560px] text-center"
        style={{
          background: "rgba(255, 255, 255, 0.55)",
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          borderRadius: "22px",
          padding: "48px 40px 32px",
          boxShadow: "0 10px 30px -12px rgba(91, 74, 106, 0.25)",
        }}
        initial={prefersReduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {/* Kicker */}
        <motion.p
          className="m-0 mb-3.5 uppercase tracking-[0.22em] text-[0.78rem] font-semibold"
          style={{ color: "var(--color-ink-soft)" }}
          initial={prefersReduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
          Hoy es un día especial
        </motion.p>

        {/* Título */}
        <h1
          className="m-0 mb-4 font-display font-normal leading-[1.1]"
          style={{ fontSize: "clamp(2.6rem, 8vw, 4.2rem)" }}
        >
          <motion.span
            className="text-gradient-pastel block"
            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            ¡Feliz
          </motion.span>
          <motion.span
            className="text-gradient-pastel block"
            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          >
            Cumpleaños!
          </motion.span>
        </h1>

        {/* Subtítulo */}
        <motion.p
          className="mx-auto mb-7 max-w-[42ch] text-[1.05rem] leading-relaxed"
          style={{ color: "var(--color-ink-soft)" }}
          initial={prefersReduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
        >
          Que este nuevo año esté lleno de color, risas y momentos mágicos.
          ¡Brindemos por ti y por todo lo bonito que viene! 🎂✨
        </motion.p>

        {/* Botones */}
        <motion.div
          className="flex gap-3.5 justify-center flex-wrap"
          initial={prefersReduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
        >
          <Button
            onClick={handleCelebrate}
            className="rounded-full min-h-12 px-7 py-3.5 text-base font-semibold text-white border-none"
            style={{
              background:
                "linear-gradient(135deg, var(--color-pink), var(--color-purple))",
              boxShadow: "0 18px 40px -18px rgba(247, 168, 196, 0.65)",
            }}
          >
            <PartyPopperIcon data-icon="inline-start" />
            Celebrar 🎉
          </Button>

          <Button
            variant="ghost"
            onClick={handleWish}
            className="rounded-full min-h-12 px-7 py-3.5 text-base font-semibold"
            style={{
              background: "rgba(255,255,255,0.7)",
              color: "var(--color-ink)",
              border: "1px solid rgba(201,182,240,0.6)",
            }}
          >
            <StarIcon data-icon="inline-start" />
            Pedir un deseo
          </Button>
        </motion.div>

        {/* Mensaje de deseo */}
        <AnimatePresence>
          {showWish && (
            <motion.div
              className="mt-7 p-5.5 rounded-[18px]"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-purple-soft), var(--color-blue-soft))",
              }}
              initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p
                className="m-0 mb-2.5 text-[1.1rem] font-medium"
                style={{ color: "var(--color-ink)" }}
              >
                Tu deseo ha sido enviado al universo ✨
              </p>
              <div className="inline-flex gap-2 text-[1.4rem]">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={
                      prefersReduced
                        ? undefined
                        : {
                            scale: [1, 1.3, 1],
                            rotate: [0, 15, 0],
                            opacity: [0.7, 1, 0.7],
                          }
                    }
                    transition={{
                      duration: 1.6,
                      delay: i * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <SparkleIcon
                      className="inline-block"
                      style={{ color: "var(--color-purple)" }}
                    />
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer
          className="mt-7.5 text-[0.85rem]"
          style={{ color: "var(--color-ink-soft)", opacity: 0.85 }}
        >
          <p className="m-0">
            Hecho con cariño · {year}
          </p>
        </footer>
      </motion.main>
    </>
  )
}
