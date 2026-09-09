import { useEffect, useRef } from "react"

interface DialogueLine {
  speaker: string
  text: string
}

interface Phase {
  title: string
  image: string
  dialogue: DialogueLine[]
}

const SPEAKER_COLORS: Record<string, string> = {
  KARIME: "#15eee3",
  "ZAYNE(don't ask)": "#9de5df",
  NARRADOR: "#f5b4f5",
  "DEVELOPER": "#490303",
}

const PHASES: Phase[] = [
  {
    title: "",
    image: "/resources/foca-fase-3.jpg",
    dialogue: [
      { speaker: "KARIME", text: "Okay, ya estoy en esta extraña página, ahora qué??" },
      { speaker: "NARRADOR", text: "Y aquí se encuentra nuestra estimada Karime, en su hábitat natural (internet)" },
      { speaker: "KARIME", text: "Qué es esto? Un juego de foca? pero dónde está la foca?" },
    ],
  },
  {
    title: "",
    image: "/resources/cosa-shock.jpg",
    dialogue: [
      { speaker: "KARIME", text: "y pq soy una bola sin forma??" },
      { speaker: "NARRADOR", text: "ehhh, el developer no sabe dibujar, conformate" },
      { speaker: "KARIME", text: "ah ok, tiene sentido, yo soy la q sabe dibujar" },
      { speaker: "KARIME", text: "pero donde está mi foca?? espero que no sea otra bolita sin forma!!!" },
      { speaker: "NARRADOR", text: "sobre eso..." },
      { speaker: "NARRADOR", text: "no había mucho budget, así que..." },
      { speaker: "KARIME", text: "si... me lo supuse" },
      { speaker: "NARRADOR", text: "bromita... aquí está tu foquita" },
    ],
  },
  {
    title: "",
    image: "/resources/seal-normal.png",
    dialogue: [
      { speaker: "ZAYNE(don't ask)", text: "HOLAAAAAA" },
      { speaker: "KARIME", text: "OMG ES UNA FOQUITA REALLL, pero poq te llamas Zayne???" },
      { speaker: "NARRADOR", text: "no lees el nombre? dice NO PREGUNTES" },
      { speaker: "KARIME", text: "a" },
    ],
  },
  {
    title: "",
    image: "/resources/seal-greeting.png",
    dialogue: [
      { speaker: "ZAYNE(don't ask)", text: "Hola persona bonita obsesionada con las focas y las cosas de mar" },
      { speaker: "ZAYNE(don't ask)", text: "el tema de mi nombre no importa ahora!!" },
      { speaker: "NARRADOR", text: "lo que dijo" },
      
    ],
  },
  {
    title: "",
    image: "/resources/seal-smiling.png",
    dialogue: [
      { speaker: "ZAYNE(don't ask)", text: "he sido creado el dia de hoy" },
      { speaker: "NARRADOR", text: "(de hecho tomó dos días hacerte)" },
      { speaker: "ZAYNE(don't ask)", text: "*Lo ignora*" },
      { speaker: "ZAYNE(don't ask)", text: "Para traerte un mensaje muy, muy importante..." },
      { speaker: "KARIME", text: "por fa decime q la blanca me va a regalar una foca real" },
      
    ],
  },
  {
    title: "",
    image: "/resources/seal-laughing.png",
    dialogue: [
      { speaker: "ZAYNE(don't ask)", text: "JAJAJA no tontita..." },
      { speaker: "NARRADOR", text: "aunque si tuviera el dinero para..." },
      { speaker: "ZAYNE(don't ask)", text: "*clears throat*" },
      { speaker: "ZAYNE(don't ask)", text: "anyways..." },
      { speaker: "NARRADOR", text: "pq de la nada habLAS INGLES" },
      
    ],
  },
  {
    title: "",
    image: "/resources/seal-normal.png",
    dialogue: [
      { speaker: "ZAYNE(don't ask)", text: "como seguía diciendo..." },
      { speaker: "ZAYNE(don't ask)", text: "mi creadora me creó y programó..." },
      
    ],
  },
   {
    title: "",
    image: "/resources/seal-bd.png",
    dialogue: [
      { speaker: "ZAYNE(don't ask)", text: "PARA DESEARTE UN MUY FELIZ CUMPLEAÑOS" },
      { speaker: "ZAYNE(don't ask)", text: "Esperamos que este nuevo año te traiga muchas alegrías y oportunidades, y que puedas alcanzar todas tus metas." },
      { speaker: "ZAYNE(don't ask)", text: "FELIZ CUMPLEAÑOS FRESIKARIIIIII!!!!" },
      { speaker: "KARIME", text: "OMG ESTOY EMOCIONADA, CONMOVIDA, FASCINADA, SORPRENDIDA, DESESPERADA, CONFUNDIDA, INCREÍBLE, ASOMBRADA, AGRADABLE, ENCANTADORA, FELIZ"},
      { speaker: "NARRADOR", text: "si ok ya entendimos..." },
    ],
  },
    {
    title: "",
    image: "/resources/Tai.png",
    dialogue: [
      { speaker: "DEVELOPER", text: "bueno, ya déjense de tanto drama que ya vino la mera GOAT (mentira)"},
      { speaker: "DEVELOPER", text: "en fin, espero que te haya gustado este pequeño jueguito modesto que te hice" },
      { speaker: "DEVELOPER", text: "no es igual de increíble que el que me hiciste vos, pero es trabajo honesto"},
      { speaker: "DEVELOPER", text: "Feliz cumpleaños Karime, te amo mucho" },
      { speaker: "NARRADOR", text: "cursi...."},
      
    ],
  },
  {
    title: "",
    image: "/resources/Tai-angwy.png",
    dialogue: [
      { speaker: "DEVELOPER", text: "cierra el pico"},
      { speaker: "NARRADOR", text: "pero si vos pusiste este diálogo..."},
      { speaker: "DEVELOPER", text: "cierto..."},
    ],
  },
  {
    title: "",
    image: "/resources/seal-laughing.png",
    dialogue: [
      { speaker: "Zayne(don't ask)", text: "como seaaaaaa, no se salgan del tema"},
      { speaker: "NARRADOR", text: "feliz cumpleaños fresikari, has llegado al final del juego byeeeee"},
    ],
  },
]

export default function SealVisualNovel() {
  const gameRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    let game: { destroy: (removeCanvas: boolean, noReturn?: boolean) => void } | undefined
    let cancelled = false
    const music = new Audio("/resources/AA-OST-MayaFey.mp3")
    music.loop = true
    music.volume = 0.35
    audioRef.current = music

    const startMusic = () => {
      void music.play().catch(() => undefined)
    }

    startMusic()
    document.addEventListener("pointerdown", startMusic, { once: true })
    document.addEventListener("keydown", startMusic, { once: true })

    void import("phaser").then(({ default: Phaser }) => {
      if (cancelled || !gameRef.current) return

      class VisualNovelScene extends Phaser.Scene {
        private phaseIndex = 0
        private lineIndex = 0
        private background?: Phaser.GameObjects.Image
        private dialogueText?: Phaser.GameObjects.Text
        private speakerText?: Phaser.GameObjects.Text
        private phaseText?: Phaser.GameObjects.Text
        private continueText?: Phaser.GameObjects.Text
        private placeholder?: Phaser.GameObjects.Container

        constructor() {
          super("visual-novel")
        }

        preload() {
          PHASES.forEach((phase, index) => {
            this.load.image(`phase-${index}`, phase.image)
          })
        }

        create() {
          this.cameras.main.setBackgroundColor("#123e59")
          this.renderPhase()

          this.input.on("pointerdown", () => this.advance())
          this.input.keyboard?.on("keydown-SPACE", () => this.advance())
          this.input.keyboard?.on("keydown-ENTER", () => this.advance())
        }

        private advance() {
          const currentPhase = PHASES[this.phaseIndex]
          if (this.lineIndex < currentPhase.dialogue.length - 1) {
            this.lineIndex += 1
            this.renderDialogue()
            return
          }

          if (this.phaseIndex < PHASES.length - 1) {
            this.phaseIndex += 1
            this.lineIndex = 0
            this.renderPhase()
            return
          }

          this.phaseIndex = 0
          this.lineIndex = 0
          this.renderPhase()
        }

        private renderPhase() {
          const width = this.scale.width
          const height = this.scale.height
          const phase = PHASES[this.phaseIndex]

          this.children.removeAll(true)
          this.placeholder = undefined

          this.add.rectangle(width / 2, height / 2, width, height, 0x123e59)
          this.add.circle(width * 0.12, height * 0.2, 70, 0x2b6d87, 0.32)
          this.add.circle(width * 0.88, height * 0.28, 110, 0x2b6d87, 0.26)

          if (this.textures.exists(`phase-${this.phaseIndex}`)) {
            this.background = this.add.image(width / 2, height * 0.39, `phase-${this.phaseIndex}`)
            const scale = Math.min(
              (width * 0.42) / this.background.width,
              (height * 0.58) / this.background.height,
            )
            this.background.setScale(scale).setAlpha(0.96)
          } else {
            this.createPlaceholder(width, height)
          }

          this.add.rectangle(width / 2, height * 0.84, width * 0.96, height * 0.28, 0x35657a, 0.94)
            .setStrokeStyle(2, 0x8ed9da, 0.7)
          this.phaseText = this.add.text(width * 0.06, height * 0.69, phase.title.toUpperCase(), {
            color: "#9de5df",
            fontFamily: "Geist Variable, sans-serif",
            fontSize: `${Math.max(14, width * 0.018)}px`,
            fontStyle: "bold",
            letterSpacing: 2,
          })
          this.renderDialogue()
        }

        private renderDialogue() {
          const width = this.scale.width
          const height = this.scale.height
          const line = PHASES[this.phaseIndex].dialogue[this.lineIndex]

          this.speakerText?.destroy()
          this.dialogueText?.destroy()
          this.continueText?.destroy()

          this.speakerText = this.add.text(width * 0.06, height * 0.755, line.speaker, {
            color: SPEAKER_COLORS[line.speaker] ?? "#ffd98f",
            fontFamily: "Geist Variable, sans-serif",
            fontSize: `${Math.max(15, width * 0.021)}px`,
            fontStyle: "bold",
          })
          this.dialogueText = this.add.text(width * 0.06, height * 0.805, line.text, {
            color: "#f3fbf8",
            fontFamily: "Fredoka Variable, sans-serif",
            fontSize: `${Math.max(17, width * 0.024)}px`,
            lineSpacing: 8,
            wordWrap: { width: width * 0.78 },
          })
          this.continueText = this.add.text(width * 0.83, height * 0.89, this.getContinueLabel(), {
            color: "#9de5df",
            fontFamily: "Geist Variable, sans-serif",
            fontSize: `${Math.max(13, width * 0.017)}px`,
            fontStyle: "bold",
          })
        }

        private getContinueLabel() {
          if (this.phaseIndex === PHASES.length - 1 && this.lineIndex === PHASES[this.phaseIndex].dialogue.length - 1) {
            return "REINICIAR  ↻"
          }
          return "CONTINUAR  ›"
        }

        private createPlaceholder(width: number, height: number) {
          const seal = this.add.ellipse(width / 2, height * 0.39, width * 0.28, height * 0.24, 0xc6d6d1)
          const face = this.add.ellipse(width / 2, height * 0.365, width * 0.22, height * 0.18, 0xe2eeea)
          const nose = this.add.ellipse(width / 2, height * 0.39, 20, 14, 0x23434d)
          const eyeLeft = this.add.circle(width * 0.46, height * 0.36, 6, 0x183640)
          const eyeRight = this.add.circle(width * 0.54, height * 0.36, 6, 0x183640)
          this.placeholder = this.add.container(0, 0, [seal, face, nose, eyeLeft, eyeRight])
          this.tweens.add({ targets: this.placeholder, y: -8, duration: 1800, yoyo: true, repeat: -1, ease: "Sine.inOut" })
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: gameRef.current,
        width: 960,
        height: 640,
        transparent: false,
        render: { antialias: true },
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: VisualNovelScene,
      })
    })

    return () => {
      cancelled = true
      document.removeEventListener("pointerdown", startMusic)
      document.removeEventListener("keydown", startMusic)
      music.pause()
      music.currentTime = 0
      audioRef.current = null
      game?.destroy(true)
    }
  }, [])

  return <div ref={gameRef} className="seal-game" aria-label="Minijuego visual novel de una foca" />
}