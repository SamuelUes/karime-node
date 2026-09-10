import { useEffect, useRef } from "react"

interface DialogueLine {
  speaker: string
  text: string
  image?: string
}

interface Phase {
  title: string
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
    dialogue: [
      { speaker: "KARIME", text: "Okay, ya estoy en esta extraña página, ahora qué??", image: "/resources/pixel/pixel-neutral.png" },
      { speaker: "NARRADOR", text: "Y aquí se encuentra nuestra estimada Karime, en su hábitat natural (internet)", image: "" },
      { speaker: "KARIME", text: "Qué es esto? Un juego de foca? pero dónde está la foca?", image: "/resources/pixel/pixel-neutral.png" },
    ],
  },
  {
    title: "",
    dialogue: [
      { speaker: "KARIME", text: "y pq m veo así??", image: "/resources/pixel/pixel-neutral.png" },
      { speaker: "NARRADOR", text: "ehhh, el developer no sabe dibujar, conformate" },
      { speaker: "KARIME", text: "ah ok, tiene sentido, yo soy la q sabe dibujar", image: "/resources/pixel/pixel-glad.svg" }, 
      { speaker: "KARIME", text: "pero donde está mi foca??" },
      { speaker: "NARRADOR", text: "sobre eso..." },
      { speaker: "NARRADOR", text: "no había mucho budget, así que..." },
      { speaker: "KARIME", text: "si... me lo supuse", image: "/resources/pixel/pixel-neutral.png" },
      { speaker: "NARRADOR", text: "bromita... aquí está tu foquita" },
    ],
  },
  {
    title: "",
    dialogue: [
      { speaker: "ZAYNE(don't ask)", text: "HOLAAAAAA", image: "/resources/seal/seal-greeting.png" },
      { speaker: "KARIME", text: "OMG ES UNA FOQUITA REALLL", image: "/resources/pixel/pixel-laugh.svg" },
      { speaker: "KARIME", text: "pero poq te llamas zayne?????'", image: "/resources/pixel/pixel-shock.svg" },
      { speaker: "NARRADOR", text: "no lees el nombre? dice NO PREGUNTES" },
      { speaker: "KARIME", text: "a", image: "/resources/pixel/pixel-neutral.png" },
    ],
  },
  {
    title: "",
    dialogue: [
      { speaker: "ZAYNE(don't ask)", text: "Hola persona bonita obsesionada con las focas y las cosas de mar", image: "/resources/seal/seal-normal.png" },
      { speaker: "ZAYNE(don't ask)", text: "el tema de mi nombre no importa ahora!!", image: "/resources/seal/seal-laughing.png" },
      { speaker: "NARRADOR", text: "lo que dijo", image: "/resources/seal/seal-normal.png" },
      
    ],
  },
  {
    title: "",
    dialogue: [
      { speaker: "ZAYNE(don't ask)", text: "he sido creado el dia de hoy", image: "/resources/seal/seal-normal.png" },
      { speaker: "NARRADOR", text: "(de hecho tomó dos días hacerte)" },
      { speaker: "ZAYNE(don't ask)", text: "*Lo ignora*", image: "/resources/seal/seal-smiling.png" },
      { speaker: "ZAYNE(don't ask)", text: "Para traerte un mensaje muy, muy importante..." },
      { speaker: "KARIME", text: "por fa decime q la blanca me va a regalar una foca real", image: "/resources/pixel/pixel-shock.svg" },
      
    ],
  },
  {
    title: "",
    dialogue: [
      { speaker: "ZAYNE(don't ask)", text: "JAJAJA no tontita...", image: "/resources/seal/seal-laughing.png"},
      { speaker: "NARRADOR", text: "aunque si tuviera el dinero para..." },
      { speaker: "ZAYNE(don't ask)", text: "*clears throat*", image: "/resources/seal/seal-normal.png" },
      { speaker: "ZAYNE(don't ask)", text: "anyways..." },
      { speaker: "NARRADOR", text: "pq de la nada habLAS INGLES" },
      
    ],
  },
  {
    title: "",
    dialogue: [
      { speaker: "ZAYNE(don't ask)", text: "como seguía diciendo...", image: "/resources/seal/seal-normal.png" },
      { speaker: "ZAYNE(don't ask)", text: "mi creadora me creó y programó..." },
      
    ],
  },
   {
    title: "",
    dialogue: [
      { speaker: "ZAYNE(don't ask)", text: "PARA DESEARTE UN MUY FELIZ CUMPLEAÑOS",  image: "/resources/seal/seal-bd.png" },
      { speaker: "ZAYNE(don't ask)", text: "Esperamos que este nuevo año te traiga muchas alegrías y oportunidades, y que puedas alcanzar todas tus metas." },
      { speaker: "ZAYNE(don't ask)", text: "FELIZ CUMPLEAÑOS FRESIKARIIIIII!!!!" },
      { speaker: "KARIME", text: "OMG ESTOY EMOCIONADA, CONMOVIDA, FASCINADA, SORPRENDIDA, DESESPERADA, CONFUNDIDA, INCREÍBLE, ASOMBRADA, AGRADABLE, ENCANTADORA, FELIZ", image: "/resources/pixel/pixel-laugh.svg" },
      { speaker: "NARRADOR", text: "si ok ya entendimos..." },
    ],
  },
    {
    title: "",
    dialogue: [
      { speaker: "DEVELOPER", text: "bueno, ya déjense de tanto drama que ya vino la mera GOAT (mentira)", image: "/resources/more/Tai.png" },
      { speaker: "DEVELOPER", text: "en fin, espero que te haya gustado este pequeño jueguito modesto que te hice", image: "/resources/more/Tai.png"},
      { speaker: "DEVELOPER", text: "no es igual de increíble que el que me hiciste vos, pero es trabajo honesto", image: "/resources/more/Tai.png" },
      { speaker: "DEVELOPER", text: "Feliz cumpleaños Karime, te amo mucho", image: "/resources/more/Tai.png" },
      { speaker: "NARRADOR", text: "cursi...."},
      
    ],
  },
  {
    title: "",
    dialogue: [
      { speaker: "DEVELOPER", text: "cierra el pico", image: "/resources/more/Tai-angwy.png" },
      { speaker: "NARRADOR", text: "pero si vos pusiste este diálogo...", image: "/resources/more/Tai-angwy.png" },
      { speaker: "DEVELOPER", text: "cierto...", image: "/resources/more/Tai-angwy.png" },
    ],
  },
  {
    title: "",
    dialogue: [
      { speaker: "Zayne(don't ask)", text: "como seaaaaaa, no se salgan del tema", image: "/resources/seal/seal-smiling.png" },
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
    const music = new Audio("/resources/more/AA-OST-MayaFey.mp3")
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
        private started = false
        private finished = false
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
            phase.dialogue.forEach((line, lineIndex) => {
              if (line.image) {
                this.load.image(`dialogue-${index}-${lineIndex}`, line.image)
              }
            })
          })
        }

        create() {
          this.cameras.main.setBackgroundColor("#123e59")
          this.renderStart()

          this.input.on("pointerdown", () => this.advance())
          this.input.keyboard?.on("keydown-SPACE", () => this.advance())
          this.input.keyboard?.on("keydown-ENTER", () => this.advance())
        }

        private advance() {
          if (!this.started || this.finished) return

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

          this.finished = true
          this.renderEnd()
        }

        private renderStart() {
          const width = this.scale.width
          const height = this.scale.height

          this.children.removeAll(true)
          this.add.rectangle(width / 2, height / 2, width, height, 0x123e59)
          this.add.circle(width * 0.12, height * 0.2, 70, 0x2b6d87, 0.32)
          this.add.circle(width * 0.88, height * 0.28, 110, 0x2b6d87, 0.26)
          this.add.circle(width * 0.5, height * 0.42, width * 0.2, 0x2b6d87, 0.16)
          this.add.text(width / 2, height * 0.25, "Karime's little adventure", {
            color: "#f3fbf8",
            fontFamily: "Pacifico, cursive",
            fontSize: `${Math.max(28, width * 0.052)}px`,
          }).setOrigin(0.5)
          this.add.text(width / 2, height * 0.4, "Un pequeño regalo para una persona muy especial", {
            color: "#9de5df",
            fontFamily: "Fredoka Variable, sans-serif",
            fontSize: `${Math.max(16, width * 0.021)}px`,
          }).setOrigin(0.5)

          const startButton = this.add.rectangle(width / 2, height * 0.63, width * 0.3, 58, 0x35657a)
            .setStrokeStyle(2, 0x8ed9da, 0.8)
            .setInteractive({ useHandCursor: true })
          this.add.text(width / 2, height * 0.63, "INICIAR JUEGO", {
            color: "#9de5df",
            fontFamily: "Geist Variable, sans-serif",
            fontSize: `${Math.max(14, width * 0.018)}px`,
            fontStyle: "bold",
          }).setOrigin(0.5)
          startButton.on("pointerdown", () => {
            this.started = true
            this.renderPhase()
          })
        }

        private renderEnd() {
          const width = this.scale.width
          const height = this.scale.height

          this.children.removeAll(true)
          this.add.rectangle(width / 2, height / 2, width, height, 0x123e59)
          this.add.circle(width * 0.12, height * 0.2, 70, 0x2b6d87, 0.32)
          this.add.circle(width * 0.88, height * 0.28, 110, 0x2b6d87, 0.26)
          this.add.text(width / 2, height / 2, "FIN", {
            color: "#f3fbf8",
            fontFamily: "Geist Variable, sans-serif",
            fontSize: `${Math.max(42, width * 0.08)}px`,
            fontStyle: "bold",
          }).setOrigin(0.5)

          const restartButton = this.add.rectangle(width / 2, height * 0.66, width * 0.28, 54, 0x35657a)
            .setStrokeStyle(2, 0x8ed9da, 0.7)
            .setInteractive({ useHandCursor: true })
          this.add.text(width / 2, height * 0.66, "REINICIAR", {
            color: "#9de5df",
            fontFamily: "Geist Variable, sans-serif",
            fontSize: `${Math.max(14, width * 0.018)}px`,
            fontStyle: "bold",
          }).setOrigin(0.5)
          restartButton.on("pointerdown", () => {
            this.finished = false
            this.phaseIndex = 0
            this.lineIndex = 0
            this.renderPhase()
          })
        }

        private renderPhase() {
          const width = this.scale.width
          const height = this.scale.height
          const phase = PHASES[this.phaseIndex]

          this.children.removeAll(true)
          this.background = undefined
          this.placeholder = undefined

          this.add.rectangle(width / 2, height / 2, width, height, 0x123e59)
          this.add.circle(width * 0.12, height * 0.2, 70, 0x2b6d87, 0.32)
          this.add.circle(width * 0.88, height * 0.28, 110, 0x2b6d87, 0.26)

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

          this.renderVisual(this.getDialogueImageKey(line))

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

        private getDialogueImageKey(line: DialogueLine) {
          if (line.image) return `dialogue-${this.phaseIndex}-${this.lineIndex}`

          for (let index = this.lineIndex - 1; index >= 0; index -= 1) {
            if (PHASES[this.phaseIndex].dialogue[index].image) {
              return `dialogue-${this.phaseIndex}-${index}`
            }
          }

          return ""
        }

        private renderVisual(imageKey: string) {
          const width = this.scale.width
          const height = this.scale.height

          if (!this.textures.exists(imageKey)) {
            this.background?.destroy()
            this.background = undefined
            if (!this.placeholder) this.createPlaceholder(width, height)
            return
          }

          this.placeholder?.destroy()
          this.placeholder = undefined
          if (!this.background) {
            this.background = this.add.image(width / 2, height * 0.39, imageKey)
          } else {
            this.background.setTexture(imageKey)
          }

          const scale = Math.min(
            (width * 0.42) / this.background.width,
            (height * 0.58) / this.background.height,
          )
          this.background
            .setPosition(width / 2, height * 0.39)
            .setScale(scale)
            .setAlpha(0.96)
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
    }).catch(() => {
      if (cancelled || !gameRef.current) return

      gameRef.current.textContent = "No se pudo cargar el juego. Recarga la página para intentarlo de nuevo."
      gameRef.current.style.display = "grid"
      gameRef.current.style.placeItems = "center"
      gameRef.current.style.padding = "24px"
      gameRef.current.style.color = "#9de5df"
      gameRef.current.style.textAlign = "center"
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