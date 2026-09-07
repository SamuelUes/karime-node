import { useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion"
import { ArrowRightIcon, ArrowLeftIcon } from "@radix-ui/react-icons"
import { Badge } from "@/components/ui/badge"

const EASE = [0.22, 1, 0.36, 1] as const

interface WishCard {
  tags: string[]
  title: string
  subtitle: string
  href: string
  img: string
  alt: string
  bg: string
}

const CARDS: WishCard[] = [
  {
    tags: ["Music", "Playlist"],
    title: "Pipipi",
    subtitle: "A humble playlist for u",
    href: "https://open.spotify.com/playlist/0HecgN8smEQzgeEEOqv4hk?si=JsDm25eWQRqYL0_YJwstAQ&utm_source=whatsapp&pi=xTY3rcm_SzGK5",
    img: "https://image-cdn-ak.spotifycdn.com/image/ab67706c000097ac35fedf1888381483a2a6d5fc",
    alt: "Primer Amanecer",
    bg: "var(--color-pink-soft)",
  },
  {
    tags: ["2024", "Sorpresa"],
    title: "Tarde de Risas",
    subtitle: "Memorias en construcción",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    img: "https://picsum.photos/seed/bday-blue/900/1100",
    alt: "Sorpresa de cumpleaños",
    bg: "var(--color-blue-soft)",
  },
  {
    tags: ["2024", "Celebración"],
    title: "Luces y Velas",
    subtitle: "La iluminación de un nuevo año",
    href: "#3",
    img: "https://picsum.photos/seed/bday-purple/900/1100",
    alt: "Velas de cumpleaños",
    bg: "var(--color-purple-soft)",
  },
  {
    tags: ["2024", "Amistad"],
    title: "Brindis Eterno",
    subtitle: "Por los momentos compartidos",
    href: "#4",
    img: "https://picsum.photos/seed/bday-peach/900/1100",
    alt: "Brindis de cumpleaños",
    bg: "#fde7d6",
  },
  {
    tags: ["2024", "Final Feliz"],
    title: "Un Nuevo Comienzo",
    subtitle: "El mejor regalo es seguir creciendo",
    href: "#5",
    img: "https://picsum.photos/seed/bday-green/900/1100",
    alt: "Nuevo comienzo",
    bg: "#d4edc8",
  },
]

export default function WishStack() {
  const prefersReduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll progress de toda la sección de cards
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  return (
    <div ref={containerRef}>
      {CARDS.map((card, i) => (
        <StackCard
          key={i}
          card={card}
          index={i}
          total={CARDS.length}
          scrollYProgress={scrollYProgress}
          prefersReduced={prefersReduced}
        />
      ))}

      {/* Filler: espacio extra para que la última card se descubra completa */}
      <div className="h-[60dvh]" aria-hidden="true" />
    </div>
  )
}

/**
 * Cada card es sticky y se queda fijada en top.
 * A medida que la siguiente card entra, la actual se reduce
 * y se desplaza hacia arriba (efecto stacking/overlay).
 */
function StackCard({
  card,
  index,
  total,
  scrollYProgress,
  prefersReduced,
}: {
  card: WishCard
  index: number
  total: number
  scrollYProgress: MotionValue<number>
  prefersReduced: boolean | null
}) {
  const imageWrapRef = useRef<HTMLDivElement>(null)

  // Rango de scroll donde esta card es "cubierta" por la siguiente.
  // Cada card ocupa 1/total del scroll total.
  // La card i empieza a ser cubierta cuando la siguiente entra.
  const segment = 1 / total
  const start = index * segment
  const end = start + segment

  // Stacking: scale + translateY + height mientras la siguiente card la cubre
  const scale = useTransform(
    scrollYProgress,
    [start, end],
    prefersReduced ? [1, 1] : [1, 0.92]
  )
  const y = useTransform(
    scrollYProgress,
    [start, end],
    prefersReduced ? [0, 0] : [0, -20]
  )
  // Altura variable: empieza en 100dvh y se reduce a 85dvh
  // al ser cubierta, dejando que la siguiente se sobreponga
  const height = useTransform(
    scrollYProgress,
    [start, end],
    prefersReduced ? ["100dvh", "100dvh"] : ["100dvh", "85dvh"]
  )

  // Parallax 3D de la imagen dentro de la card
  const { scrollYProgress: imgProgress } = useScroll({
    target: imageWrapRef,
    offset: ["start end", "end start"],
  })

  const rotateX = useTransform(
    imgProgress,
    [0, 0.5, 1],
    prefersReduced ? [0, 0, 0] : [6, 0, -6]
  )
  const rotateY = useTransform(
    imgProgress,
    [0, 0.5, 1],
    prefersReduced ? [0, 0, 0] : [-8, 0, 8]
  )
  const imgY = useTransform(
    imgProgress,
    [0, 1],
    prefersReduced ? [0, 0] : [-30, 30]
  )
  const imgScale = useTransform(
    imgProgress,
    [0, 0.5, 1],
    prefersReduced ? [1, 1, 1] : [1.08, 1, 1.08]
  )

  return (
    <motion.div
      className="sticky top-0 grid place-items-center"
      style={{
        scale,
        y,
        height,
        willChange: "transform, height",
      }}
    >
      <a
        href={card.href}
        target={card.href.startsWith("http") ? "_blank" : undefined}
        rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="group block w-full max-w-[1100px] overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[min(560px,70dvh)] no-underline"
        style={{
          background: card.bg,
          color: "var(--color-ink)",
          borderRadius: "24px",
          boxShadow: "0 1px 20px 0px rgba(19, 16, 20, 0.5)",
          transformOrigin: "center bottom",
        }}
      >
        {/* Left content */}
        <div className="flex flex-col justify-between gap-6 p-10 max-md:p-7 max-md:gap-4.5">
          {/* Tags */}
          <div className="flex gap-2.5 flex-wrap">
            {card.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border-[var(--color-ink)] text-[0.8rem] font-semibold tracking-[0.04em] h-auto py-1.5 px-4"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title + subtitle */}
          <div className="flex flex-col gap-1.5">
            <h2
              className="m-0 font-bold leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
            >
              {card.title}
            </h2>
            <p
              className="m-0 font-medium"
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
                color: "rgba(15, 14, 14, 0.4)",
              }}
            >
              {card.subtitle}
            </p>
          </div>

          {/* CTA button */}
          <div className="flex">
            <span
              className="group/cta inline-flex items-center gap-2.5 font-semibold p-3 px-5.5 text-[0.95rem] transition-all"
              style={{
                background: "var(--color-ink)",
                color: card.bg,
                borderRadius: "40px",
              }}
            >
              <span>Ver momento</span>
              <ArrowRightIcon className="transition-transform group-hover/cta:translate-x-1" />
            </span>
          </div>
        </div>

        {/* Right image con perspectiva 3D */}
        <div
          ref={imageWrapRef}
          className="relative overflow-hidden max-md:h-[240px]"
          style={{ perspective: 800, borderRadius: "8px" }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              rotateX,
              rotateY,
              y: imgY,
              scale: imgScale,
              transformStyle: "preserve-3d",
            }}
          >
            <img
              src={card.img}
              alt={card.alt}
              loading="lazy"
              className="block w-full h-full object-cover"
              style={{
                borderRadius: "inherit",
              }}
            />
          </motion.div>
        </div>
      </a>
    </motion.div>
  )
}

export function WishBackLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 font-semibold text-[0.95rem] no-underline rounded-full transition-all hover:-translate-x-0.5"
      style={{
        color: "var(--color-ink)",
        padding: "8px 14px",
      }}
    >
      <ArrowLeftIcon />
      Volver
    </a>
  )
}
