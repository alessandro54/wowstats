const PLAGUE = "rgba(0,210,70,"
const TOXIC = "rgba(120,255,80,"
const SICKLY = "rgba(160,230,100,"
const BONE = "rgba(200,210,185,"
const VOID = "rgba(140,60,220,"

const COUNT = 120

function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

class PlagueParticle {
  type = 0
  x = 0
  y = 0
  r = 0
  vy = 0
  vx = 0
  swayAmp = 0
  swayFq = 0
  phase = 0
  swimAmp = 0
  swimFq = 0
  swimPh = 0
  alpha = 0
  alphaDelta = 0
  blink = false
  blinkPhase = 0
  blinkFreq = 0
  wispLen = 0
  fadeStart = 0
  W: number
  H: number
  // Cached
  sporeGrad: CanvasGradient | null = null
  ashGrad: CanvasGradient | null = null
  voidGrad: CanvasGradient | null = null
  emberGrad: CanvasGradient | null = null
  sporeColor = PLAGUE

  constructor(ctx: CanvasRenderingContext2D, W: number, H: number, fresh: boolean) {
    this.W = W
    this.H = H
    this.reset(ctx, fresh)
  }

  reset(ctx: CanvasRenderingContext2D, fresh: boolean) {
    const r = Math.random()
    this.type = r < 0.4 ? 0 : r < 0.65 ? 1 : r < 0.8 ? 2 : r < 0.93 ? 3 : 4

    this.x = rand(0, this.W)
    this.y = fresh ? rand(0, this.H) : rand(this.H * 0.7, this.H + 30)

    this.r =
      this.type === 0
        ? rand(2, 5.5)
        : this.type === 1
          ? rand(0.6, 1.6)
          : this.type === 2
            ? rand(1.5, 3)
            : this.type === 3
              ? rand(2, 4.5)
              : rand(0.8, 1.8)

    this.vy = -rand(0.15, 0.65) * (0.4 + this.r * 0.1)
    this.vx = rand(-0.12, 0.12)
    this.swayAmp = rand(0.2, 0.8)
    this.swayFq = rand(0.006, 0.018)
    this.phase = rand(0, Math.PI * 2)
    this.swimAmp = this.type === 2 ? rand(0.3, 0.7) : 0
    this.swimFq = rand(0.02, 0.05)
    this.swimPh = rand(0, Math.PI * 2)

    const maxA = this.type === 4 ? 0.7 : this.type === 1 ? 0.35 : this.type === 3 ? 0.38 : 0.48
    this.alpha = rand(0.04, maxA)
    this.alphaDelta = (Math.random() < 0.5 ? 1 : -1) * rand(0.0015, 0.005)

    this.blink = this.type === 4
    this.blinkPhase = rand(0, Math.PI * 2)
    this.blinkFreq = rand(0.05, 0.12)
    this.wispLen = this.type === 2 ? rand(6, 18) : 0
    this.fadeStart = rand(this.H * 0.05, this.H * 0.25)

    // Cache gradients per type
    if (this.type === 0) {
      this.sporeColor = Math.random() < 0.5 ? PLAGUE : SICKLY
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 2.4)
      g.addColorStop(0, this.sporeColor + "0.95)")
      g.addColorStop(0.35, this.sporeColor + "0.5)")
      g.addColorStop(0.7, this.sporeColor + "0.12)")
      g.addColorStop(1, this.sporeColor + "0)")
      this.sporeGrad = g
    } else if (this.type === 1) {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 3.5)
      g.addColorStop(0, BONE + "0.2)")
      g.addColorStop(1, BONE + "0)")
      this.ashGrad = g
    } else if (this.type === 3) {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 2.6)
      g.addColorStop(0, VOID + "0.9)")
      g.addColorStop(0.4, VOID + "0.35)")
      g.addColorStop(0.75, VOID + "0.08)")
      g.addColorStop(1, VOID + "0)")
      this.voidGrad = g
    } else if (this.type === 4) {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 4)
      g.addColorStop(0, TOXIC + "0.3)")
      g.addColorStop(1, TOXIC + "0)")
      this.emberGrad = g
    }
  }

  update(ctx: CanvasRenderingContext2D, t: number) {
    this.y += this.vy
    this.x += this.vx + Math.sin(t * this.swayFq + this.phase) * this.swayAmp
    if (this.type === 2) this.x += Math.sin(t * this.swimFq + this.swimPh) * this.swimAmp
    this.alpha += this.alphaDelta
    if (this.alpha > 0.55 || this.alpha < 0.02) this.alphaDelta *= -1
    if (this.blink) this.blinkPhase += this.blinkFreq
    if (this.y < -20 || this.x < -40 || this.x > this.W + 40) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D, t: number) {
    const topFade = Math.min(1, Math.max(0, (this.y - this.fadeStart) / (this.H * 0.15)))
    const botFade = Math.min(1, Math.max(0, (this.H - this.y) / (this.H * 0.15)))
    let a = this.alpha * topFade * botFade
    if (this.blink) a *= 0.4 + 0.6 * Math.abs(Math.sin(this.blinkPhase))
    if (a < 0.005) return

    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.globalAlpha = a

    switch (this.type) {
      case 0: // Spore
        ctx.fillStyle = this.sporeGrad!
        ctx.beginPath()
        ctx.arc(0, 0, this.r * 2.4, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = this.sporeColor + "0.8)"
        ctx.beginPath()
        ctx.arc(0, 0, this.r * 0.35, 0, Math.PI * 2)
        ctx.fill()
        break
      case 1: // Ash
        ctx.fillStyle = BONE + "1)"
        ctx.beginPath()
        ctx.arc(0, 0, this.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = this.ashGrad!
        ctx.beginPath()
        ctx.arc(0, 0, this.r * 3.5, 0, Math.PI * 2)
        ctx.fill()
        break
      case 2: {
        // Wisp — gradient must be dynamic (direction changes)
        const col = Math.random() < 0.7 ? PLAGUE : SICKLY
        const angle =
          Math.atan2(this.vy, this.vx + Math.sin(t * this.swimFq + this.swimPh) * this.swimAmp) -
          Math.PI / 2
        ctx.rotate(angle)
        // Simple circles instead of expensive gradient wisp
        ctx.fillStyle = col + "0.5)"
        ctx.beginPath()
        ctx.arc(0, 0, this.r * 1.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = col + "0.2)"
        ctx.beginPath()
        ctx.ellipse(0, this.wispLen / 2, this.r * 0.4, this.wispLen / 2, 0, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 3: // Void
        ctx.fillStyle = this.voidGrad!
        ctx.beginPath()
        ctx.arc(0, 0, this.r * 2.6, 0, Math.PI * 2)
        ctx.fill()
        break
      case 4: // Ember — replaced shadowBlur with cached gradient
        ctx.fillStyle = TOXIC + "1)"
        ctx.beginPath()
        ctx.arc(0, 0, this.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = this.emberGrad!
        ctx.beginPath()
        ctx.arc(0, 0, this.r * 4, 0, Math.PI * 2)
        ctx.fill()
        break
    }
    ctx.restore()
  }
}

export function runPlague(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const particles: PlagueParticle[] = []
  for (let i = 0; i < COUNT; i++) particles.push(new PlagueParticle(ctx, W, H, true))

  let t = 0
  let raf = 0

  function render() {
    ctx.clearRect(0, 0, W, H)
    t++
    for (const p of particles) {
      p.update(ctx, t)
      p.draw(ctx, t)
    }
    raf = requestAnimationFrame(render)
  }
  render()

  return () => cancelAnimationFrame(raf)
}
