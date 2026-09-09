import { motion, useReducedMotion } from "framer-motion"

interface Props {
  showBalloons?: boolean
  showBlobs?: boolean
}

/**
 * Fondo decorativo animado: aurora + blobs + globos flotantes.
 * Replica el fondo del proyecto original usando framer-motion
 * para los globos y CSS animations para aurora/blobs.
 */
export default function AnimatedBackground({
  showBalloons = true,
  showBlobs = true,
}: Props) {
  const prefersReduced = useReducedMotion()

  const balloons = [
    { x: "8%", d: 0, c: "var(--color-pink)" },
    { x: "22%", d: 1.2, c: "var(--color-blue)" },
    { x: "38%", d: 0.6, c: "var(--color-purple)" },
    { x: "55%", d: 1.8, c: "var(--color-pink-soft)" },
    { x: "70%", d: 0.9, c: "var(--color-blue-soft)" },
    { x: "86%", d: 1.5, c: "var(--color-purple-soft)" },
  ]

  return (
    <>
      {/* Aurora */}
      <div
        className="bg-aurora fixed inset-0 -z-20"
        aria-hidden="true"
        style={prefersReduced ? { animation: "none" } : undefined}
      />

      {/* Blobs */}
      {showBlobs && (
        <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
          <div
            className="absolute size-80 rounded-full opacity-55 blur-[40px]"
            style={{
              background: "var(--color-pink)",
              top: "-60px",
              left: "-80px",
              animation: prefersReduced ? "none" : "floatBlob 14s ease-in-out infinite",
            }}
          />
          <div
            className="absolute size-80 rounded-full opacity-55 blur-[40px]"
            style={{
              background: "var(--color-blue)",
              bottom: "-80px",
              right: "-60px",
              animation: prefersReduced
                ? "none"
                : "floatBlob 14s ease-in-out infinite",
              animationDelay: "-4s",
            }}
          />
          <div
            className="absolute size-80 rounded-full opacity-55 blur-[40px]"
            style={{
              background: "var(--color-purple)",
              top: "40%",
              left: "55%",
              animation: prefersReduced
                ? "none"
                : "floatBlob 14s ease-in-out infinite",
              animationDelay: "-8s",
            }}
          />
        </div>
      )}

      {/* Globos flotantes */}
      {showBalloons && !prefersReduced && (
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
          {balloons.map((b, i) => (
            <motion.span
              key={i}
              className="absolute text-4xl"
              style={{
                bottom: "-120px",
                left: b.x,
                color: b.c,
                filter: "drop-shadow(0 8px 14px rgba(91,74,106,0.18))",
              }}
              animate={{
                y: ["0vh", "-115vh"],
                rotate: [0, 8],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 12,
                delay: b.d,
                repeat: Infinity,
                ease: "linear",
                opacity: {
                  duration: 12,
                  delay: b.d,
                  repeat: Infinity,
                  times: [0, 0.1, 0.9, 1],
                  ease: "linear",
                },
              }}
            >
              🎈
            </motion.span>
          ))}
        </div>
      )}
    </>
  )
}
