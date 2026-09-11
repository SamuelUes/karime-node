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
    alt: "Playlist de cumpleaños",
    bg: "#EDDAE9",
  },
  {
    tags: ["Interest", "People"],
    title: "The Birthday Board",
    subtitle: "People that remind me of you",
    href: "https://pin.it/5TKGlyzir",
    img: "/resources/more/flins.jpg",
    alt: "Sorpresa de cumpleaños",
    bg: "#745faf",
  },
  {
    tags: ["Sea", "Surprise"],
    title: "Guess what I am...",
    subtitle: "I know you're curious... just click",
    href: "/foca",
    img: "/resources/more/foquilla.jpg",
    alt: "Velas de cumpleaños",
    bg: "#9fe1ff",
  },
  {
    tags: ["Gifts", "Small trinkets"],
    title: "Birthday Party",
    subtitle: "literalmente todas las piezas esenciales de un cumpleaños",
    href: "/links",
    img: "/resources/more/Durin-Birthday.jpg",
    alt: "Brindis de cumpleaños",
    bg: "#c565dd",
  },
  {
    tags: ["Game", "Mystery"],
    title: "The stolen cake",
    subtitle: "¿Quién se ha robado el pastel?",
    href: "/caso",
    img: "/resources/more/AA.jpg",
    alt: "AA Case",
    bg: "#f5c3e2",
  },
  {
    tags: ["Videos", "Memories"],
    title: "Collection",
    subtitle: "Feliz cumpleaños, de parte de toda tu familia <3",
    href: "https://drive.google.com/drive/folders/1jYK0Npa-JROpKmASijr0Kga2MD5x4P7Z?usp=drive_link",
    img: "/resources/more/deltarune.jpg",
    alt: "AA Case",
    bg: "#c5f39a",
  },
]

export default function WishStack() {
  const prefersReduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  return (
    <div ref={containerRef} className="relative">
      {CARDS.map((card, i) => (
        <StackCard
          key={`${card.title}-${i}`}
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

  const segment = 1 / total
  const start = index * segment
  const end = start + segment

  const scale = useTransform(
    scrollYProgress,
    [start, end],
    prefersReduced ? [1, 1] : [1, 0.92]
  )
  const cardY = useTransform(
    scrollYProgress,
    [start, end],
    prefersReduced ? [0, 0] : [0, -20]
  )

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

  const isExternal = /^https?:\/\//.test(card.href)

  return (
    <motion.div
      className="sticky top-0 grid h-[100dvh] place-items-center px-6 py-8 max-md:px-4 max-md:py-5"
      style={{
        scale,
        y: cardY,
        zIndex: index + 1,
        willChange: "transform",
      }}
    >
      <a
        href={card.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        aria-label={`Abrir ${card.title}`}
        className="group grid w-full max-w-[1100px] grid-cols-[0.9fr_1.1fr] overflow-hidden no-underline max-md:grid-cols-1"
        style={{
          background: card.bg,
          color: "#131012",
          borderRadius: "24px",
          boxShadow: "0 1px 20px 0 rgba(19, 16, 20, 0.5)",
          transformOrigin: "center bottom",
        }}
      >
        {/* Left content */}
        <div className="flex min-h-[min(560px,70dvh)] flex-col justify-between gap-8 p-10 max-md:min-h-0 max-md:gap-12 max-md:p-7">
          {/* Tags */}
          <div className="flex flex-wrap gap-2.5">
            {card.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="h-auto rounded-full border-[#131012] px-4 py-1.5 text-[0.8rem] font-semibold tracking-[0.04em] text-[#131012]"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title + subtitle */}
          <div className="flex flex-col gap-1.5">
            <h2
              className="m-0 font-sans font-bold leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
            >
              {card.title}
            </h2>
            <p
              className="m-0 font-sans font-medium leading-[1.1]"
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
                color: "rgba(19, 16, 18, 0.4)",
              }}
            >
              {card.subtitle}
            </p>
          </div>

          {/* CTA button */}
          <div className="flex">
            <span
              className="inline-flex items-center gap-2.5 rounded-[40px] p-3 px-5.5 font-sans text-[0.95rem] font-semibold transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5"
              style={{
                background: "#131012",
                color: card.bg,
              }}
            >
              <span>Ver momento</span>
              <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>

        {/* Right image con perspectiva 3D */}
        <div
          ref={imageWrapRef}
          className="relative min-h-[min(560px,70dvh)] overflow-hidden max-md:min-h-0 max-md:h-[240px]"
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
              className="block h-full w-full object-cover"
              style={{ borderRadius: "inherit" }}
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
      className="inline-flex items-center gap-1.5 rounded-full p-2 px-3.5 font-semibold text-[0.95rem] no-underline transition-all hover:-translate-x-0.5"
      style={{ color: "var(--color-ink)" }}
    >
      <ArrowLeftIcon />
      Volver
    </a>
  )
}
