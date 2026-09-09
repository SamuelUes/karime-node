import { useRef, useState, useEffect } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion"
import { HeartIcon } from "@radix-ui/react-icons"

const SERVICES = [
  {
    name: "Beautiful",
    phrase: "But I promise that I love you\nEven with that hair-do\nI'm sorry I made fun of it\nIt's not your fault it looks like shit",
    img: "/resources/Kari/Kari16.jpeg",
  },
  {
    name: "Elegant",
    phrase: "I have never tolerated someone for so long\nI've never laughed so much\nI haven't written a sad song\nThere's no one else I'd rather fall asleep with\nAnd dream with\nYou're my best friend in the world",
    img: "/resources/Kari/Kari17.jpeg",
  },
  {
    name: "Silly",
    phrase: "When we're ninety-eight and ninety-nine\nTumblin' down the stairs\nYou'll barely catch me in time\nWe'll argue about what to watch on TV\nFinally pick a movie, then we'll fall asleep",
    img: "/resources/Kari/Kari18.jpeg",
  },
  {
    name: "Lovely",
    phrase: "We'll still be a little bit strange\nSome things never change",
    img: "/resources/Kari/Kari19.jpeg",
  },
  {
    name: "a literal meme lol",
    phrase: "It's funny ‘cause you drive me half-insane\nA universe without you would be thoroughly mundane\nThere's no one else I'd rather fall in love with\nAnd that is\nMy best friend in the world",
    img: "/resources/Kari/Kari20.jpeg",
  },
  {
    name: "You're my best friend in the world",
    img: "/resources/Kari/Kari25.jpeg",
  },
]

export default function ServicesSection() {
  const prefersReduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const triggersRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: triggersRef,
    offset: ["start start", "end end"],
  })

  // Tilt 3D de la imagen flotante
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 6])
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : -15])
  const translateX = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : -35])
  const translateY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 12])

  // Detectar qué trigger está más cerca del centro
  useEffect(() => {
    if (!triggersRef.current) return

    let ticking = false

    const update = () => {
      const vh = window.innerHeight
      const center = vh / 2
      const triggers = triggersRef.current?.querySelectorAll("[data-trigger]")
      if (!triggers) return

      let closest = 0
      let closestDist = Infinity

      triggers.forEach((trigger, i) => {
        const rect = trigger.getBoundingClientRect()
        const triggerCenter = rect.top + rect.height / 2
        const dist = Math.abs(triggerCenter - center)
        if (dist < closestDist) {
          closestDist = dist
          closest = i
        }
      })

      setActiveIndex(closest)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="font-body text-[var(--color-ink)]"
      style={{ padding: 0, margin: 0 }}
    >
      {/* Label */}
      <div className="flex items-start gap-1.5 pt-[clamp(60px,10vw,140px)] pb-[clamp(40px,6vw,80px)] px-[clamp(24px,6vw,80px)]">
        <p className="m-0 text-[clamp(1rem,1.8vw,1.4rem)] font-medium leading-[1.3]">
          Just us being us when
        </p>
        <HeartIcon className="mt-1" />
      </div>

      {/* Container: sticky image + scroll list */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 pb-[clamp(60px,10vw,120px)]">
        {/* Center: Sticky floating image */}
        <div className="relative order-2 md:absolute md:inset-0 md:z-0">
          <div className="sticky top-0 h-screen flex items-center justify-center px-[clamp(24px,4vw,60px)] max-md:relative max-md:h-auto max-md:py-10">
            <motion.div
              className="relative rounded-2xl"
              style={{
                width: "clamp(280px, 24.7vw, 456px)",
                height: "clamp(346px, 30.5vw, 564px)",
                perspective: 800,
                rotateX,
                rotateY,
                x: translateX,
                y: translateY,
                transformStyle: "preserve-3d",
              }}
            >
              {SERVICES.map((svc, i) => (
                <div
                  key={svc.name}
                  className="absolute inset-0 rounded-2xl overflow-hidden transition-all duration-500"
                  style={{
                    opacity: activeIndex === i ? 1 : 0,
                    transform: activeIndex === i ? "scale(1)" : "scale(1.02)",
                    pointerEvents: activeIndex === i ? "auto" : "none",
                    transition: prefersReduced ? "none" : undefined,
                  }}
                >
                  <div className="group relative h-full w-full overflow-hidden rounded-2xl">
                    <img
                      src={svc.img}
                      alt={svc.name}
                      loading="lazy"
                      className="block h-full w-full rounded-2xl object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right: Scroll-trigger list */}
        <div ref={triggersRef} className="relative order-1 md:col-start-2 md:z-10">
          {SERVICES.map((svc, i) => (
            <div
              key={svc.name}
              data-trigger
              className="h-screen max-md:h-[60vh] flex items-center justify-end px-[clamp(24px,6vw,80px)]"
            >
              <motion.div
                className="text-right"
                style={{
                  opacity: activeIndex === i ? 1 : 0.325,
                  transition: prefersReduced
                    ? "none"
                    : "opacity 400ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <h1
                  className="m-0 font-semibold leading-none"
                  style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
                >
                  {svc.name}
                </h1>
                <p className="m-0 mt-4 whitespace-pre-line text-[clamp(0.9rem,1.5vw,1.15rem)] font-normal leading-relaxed text-[var(--color-ink-soft)]">
                  {svc.phrase}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
