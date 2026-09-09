import { useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion"
import { ArrowDownIcon } from "@radix-ui/react-icons"

const EASE = [0.22, 1, 0.36, 1] as const
const RANGE = 96
const CONTENT_TRAVEL = 137.508

interface ImageConfig {
  src: string
  alt: string
  speed: number
  className: string
}

const IMAGES: ImageConfig[] = [
  {
    src: "https://picsum.photos/seed/bday-about-1/300/400",
    alt: "Recuerdo 1",
    speed: 0.18,
    className: "about__img--1",
  },
  {
    src: "https://picsum.photos/seed/bday-about-2/320/400",
    alt: "Recuerdo 2",
    speed: 0.12,
    className: "about__img--2",
  },
  {
    src: "https://picsum.photos/seed/bday-about-3/360/432",
    alt: "Recuerdo 3",
    speed: 0.08,
    className: "about__img--3",
  },
  {
    src: "https://picsum.photos/seed/bday-about-4/300/400",
    alt: "Recuerdo 4",
    speed: 0.22,
    className: "about__img--4",
  },
  {
    src: "https://picsum.photos/seed/bday-about-5/300/400",
    alt: "Recuerdo 5",
    speed: 0.14,
    className: "about__img--5",
  },
  {
    src: "https://picsum.photos/seed/bday-about-6/280/350",
    alt: "Recuerdo 6",
    speed: 0.28,
    className: "about__img--6",
  },
]

export default function AboutSection() {
  const prefersReduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  return (
    <motion.section
      ref={sectionRef}
      aria-label="About us"
      className="relative w-full min-h-[180vh] overflow-hidden py-[clamp(80px,14vw,200px)]"
      style={{
        background:
          "linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.35), transparent)",
      }}
      initial={prefersReduced ? undefined : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div className="relative mx-auto min-h-[120vh] w-full max-w-[1400px]">
        {IMAGES.map((img, index) => (
          <ParallaxImage
            key={img.className}
            img={img}
            index={index}
            scrollYProgress={scrollYProgress}
            prefersReduced={prefersReduced}
          />
        ))}

        <CenterContent
          scrollYProgress={scrollYProgress}
          prefersReduced={prefersReduced}
        />
      </div>
    </motion.section>
  )
}

function ParallaxImage({
  img,
  index,
  scrollYProgress,
  prefersReduced,
}: {
  img: ImageConfig
  index: number
  scrollYProgress: MotionValue<number>
  prefersReduced: boolean | null
}) {
  const dir = img.speed > 0.15 ? -1 : 1
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced
      ? [0, 0]
      : [-RANGE * img.speed * dir, RANGE * img.speed * dir]
  )
  const y = useSpring(rawY, {
    stiffness: 90,
    damping: 24,
    mass: 0.7,
  })

  return (
    <motion.div
      className={`about__img absolute z-1 overflow-hidden rounded-[18px] ${img.className}`}
      style={{
        y,
        background:
          "linear-gradient(135deg, var(--color-pink-soft), var(--color-blue-soft))",
        boxShadow: "0 20px 50px -18px rgba(91, 74, 106, 0.35)",
      }}
      initial={prefersReduced ? undefined : { opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1 * (index + 1), ease: EASE }}
    >
      <img
        src={img.src}
        alt={img.alt}
        loading="lazy"
        className="block h-full w-full object-cover object-center"
      />
    </motion.div>
  )
}

function CenterContent({
  scrollYProgress,
  prefersReduced,
}: {
  scrollYProgress: MotionValue<number>
  prefersReduced: boolean | null
}) {
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? [0, 0] : [CONTENT_TRAVEL, -CONTENT_TRAVEL]
  )
  const contentY = useSpring(rawY, {
    stiffness: 90,
    damping: 24,
    mass: 0.7,
  })

  return (
    <motion.div
      className="absolute left-1/2 top-[clamp(24px,4vh,64px)] z-20 w-full max-w-[560px] px-6 text-center max-md:max-w-[calc(100%_-_32px)]"
      style={{ x: "-50%", y: contentY }}
    >
      <div
        className="mb-7 inline-flex items-center gap-1.5 rounded-full px-4.5 py-2"
        style={{
          background: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.7)",
        }}
      >
        <span
          className="text-[clamp(0.9rem,1.4vw,1.1rem)] font-semibold tracking-[0.04em]"
          style={{ color: "var(--color-ink)" }}
        >
          Memories
        </span>
        <ArrowDownIcon style={{ color: "var(--color-ink)" }} />
      </div>

      <h2
        className="font-display m-0 mb-7 font-normal leading-[1.15] text-gradient-pastel"
        style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
      >
        The sweetest
        <br />
        girl
        <br />
        of all time
      </h2>

      <p
        className="mx-auto max-w-[48ch] font-normal leading-relaxed"
        style={{
          fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
          color: "var(--color-ink)",
        }}
      >
        A little something just to express my love for being the best little sister in the whole world.
      </p>
    </motion.div>
  )
}
