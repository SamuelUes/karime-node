import { useRef, useState, useEffect } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion"
import { ArrowDownIcon } from "@radix-ui/react-icons"

const SERVICES = [
  {
    name: "Art Direction",
    img: "https://picsum.photos/seed/svc-art/456/564",
  },
  {
    name: "Production",
    img: "https://picsum.photos/seed/svc-production/456/564",
  },
  {
    name: "Strategy",
    img: "https://picsum.photos/seed/svc-strategy/456/564",
  },
  {
    name: "Rebranding",
    img: "https://picsum.photos/seed/svc-rebranding/456/564",
  },
  {
    name: "Design",
    img: "https://picsum.photos/seed/svc-design/456/564",
  },
]

const CLIENTS =
  "American Express / Coop / Diesel / Facebook / Hinge / Interbrand / KFC / Heineken / Maneskin / National Museum / Neon Lopez / Paul Smith / Post it / Renault / Snake / Saint Laurent / Sensaya / The Tech Collective / Veralab"

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
      className="bg-[#f7f7f7] text-[#0f0e0e] font-body"
      style={{ padding: 0, margin: 0 }}
    >
      {/* Label */}
      <div className="flex items-start gap-1.5 pt-[clamp(60px,10vw,140px)] pb-[clamp(40px,6vw,80px)] px-[clamp(24px,6vw,80px)]">
        <p className="m-0 text-[clamp(1rem,1.8vw,1.4rem)] font-medium leading-[1.3]">
          What we do
        </p>
        <ArrowDownIcon className="mt-1" />
      </div>

      {/* Container: sticky image + scroll list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 pb-[clamp(60px,10vw,120px)]">
        {/* Left: Sticky floating image */}
        <div className="relative order-2 md:order-1">
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
                    transition: prefersReduced ? "none" : undefined,
                  }}
                >
                  <img
                    src={svc.img}
                    alt={svc.name}
                    loading="lazy"
                    className="block w-full h-full object-cover object-center rounded-2xl"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right: Scroll-trigger list */}
        <div ref={triggersRef} className="relative order-1 md:order-2">
          {SERVICES.map((svc, i) => (
            <div
              key={svc.name}
              data-trigger
              className="h-screen max-md:h-[60vh] flex items-center justify-end px-[clamp(24px,6vw,80px)]"
            >
              <motion.h1
                className="m-0 text-right font-semibold leading-none"
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                  opacity: activeIndex === i ? 1 : 0.325,
                  transition: prefersReduced
                    ? "none"
                    : "opacity 400ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {svc.name}
              </motion.h1>
            </div>
          ))}
        </div>
      </div>

      {/* Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-black/8 px-[clamp(24px,6vw,80px)] pt-[clamp(40px,6vw,80px)] pb-[clamp(60px,10vw,140px)]">
        <div>
          <p className="m-0 text-[clamp(1rem,1.8vw,1.4rem)] font-medium leading-[1.3]">
            Right now we're
            <br />
            working with
          </p>
        </div>
        <div className="flex items-center justify-end max-md:justify-start">
          <p className="m-0 text-right max-md:text-left text-[clamp(0.95rem,1.5vw,1.15rem)] font-normal leading-relaxed max-w-[50ch]">
            {CLIENTS}
          </p>
        </div>
      </div>
    </section>
  )
}
