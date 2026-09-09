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

const PHASES: Phase[] = [
  {
    title: "Fase 1 · La orilla",
    image: "/resources/seal-normal.png",
    dialogue: [
      { speaker: "NARRADOR", text: "[Escribe aquí el primer diálogo de tu historia.]" },
      { speaker: "FOCA", text: "[Añade aquí la respuesta de la foca.]" },
    ],
  },
  {
    title: "Fase 2 · Bajo las olas",
    image: "/resources/seal-normal.png",
    dialogue: [
      { speaker: "NARRADOR", text: "[Este es el diálogo independiente de la segunda fase.]" },
      { speaker: "FOCA", text: "[La foca puede decir algo nuevo aquí.]" },
    ],
  },
  {
    title: "Fase 3 · Un nuevo día",
    image: "/resources/foca-fase-3.jpg",
    dialogue: [
      { speaker: "NARRADOR", text: "[Escribe aquí el cierre de la aventura.]" },
      { speaker: "FOCA", text: "[Añade el último mensaje de la foca.]" },
    ],
  },
  {
    title: "fsdgsdsdf",
    image: "/resources/foca-fase-3.jpg",
    dialogue: [
      { speaker: "NARRADOR", text: "[Escribe aquí el cierre de la aventura.]" },
      { speaker: "FOCA", text: "[Añade el último mensaje de la foca.]" },
    ],
  },
]

export default function SealVisualNovel() {
  const gameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let game: { destroy: (removeCanvas: boolean, noReturn?: boolean) => void } | undefined
    let cancelled = false

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

          this.add.rectangle(width / 2, height * 0.84, width * 0.96, height * 0.28, 0x092b42, 0.94)
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
            color: "#ffd98f",
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
      game?.destroy(true)
    }
  }, [])

  return <div ref={gameRef} className="seal-game" aria-label="Minijuego visual novel de una foca" />
}