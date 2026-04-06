const COLORS = [
  "rgba(255,255,255,",
  "rgba(200,235,255,",
  "rgba(180,225,250,",
  "rgba(210,240,255,",
  "rgba(126,200,227,",
]

const COUNT = 100

function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

function randInt(a: number, b: number) {
  return Math.floor(rand(a, b + 1))
}

class Flake {
  type = 0
  x = 0
  y = 0
  r = 0
  speed = 0
  drift = 0
  driftAmp = 0
  driftFq = 0
  phase = 0
  alpha = 0
  alphaTarget = 0
  alphaDelta = 0
  color = ""
  rot = 0
  rotSpeed = 0
  twinkle = false
  twinklePhase = 0
  twinkleFreq = 0
  W: number
  H: number
  // Cached gradients
  grad: CanvasGradient | null = null
  glowGrad: CanvasGradient | null = null

  constructor(ctx: CanvasRenderingContext2D, W: number, H: number, fresh: boolean) {
    this.W = W
    this.H = H
    this.reset(ctx, fresh)
  }

  reset(ctx: CanvasRenderingContext2D, fresh: boolean) {
    this.type = Math.random() < 0.55 ? 0 : Math.random() < 0.55 ? 1 : Math.random() < 0.65 ? 3 : 2
    this.x = rand(0, this.W)
    this.y = fresh ? rand(-this.H * 0.1, this.H * 1.05) : rand(-80, -10)
    this.r =
      this.type === 2
        ? rand(4.5, 8)
        : this.type === 1
          ? rand(0.8, 1.8)
          : this.type === 3
            ? rand(1, 2.5)
            : rand(1.2, 3.5)
    this.speed = rand(0.25, 0.9) * (this.r * 0.35 + 0.4)
    this.drift = rand(-0.18, 0.18)
    this.driftAmp = rand(0.25, 0.7)
    this.driftFq = rand(0.003, 0.012)
    this.phase = rand(0, Math.PI * 2)
    this.color = COLORS[randInt(0, COLORS.length - 1)]
    const maxA = this.type === 2 ? 0.55 : this.type === 1 ? 0.45 : 0.5
    this.alpha = rand(0.08, maxA)
    this.alphaTarget = this.alpha
    this.alphaDelta = (Math.random() < 0.5 ? 1 : -1) * rand(0.002, 0.008)
    this.rot = rand(0, Math.PI * 2)
    this.rotSpeed = rand(-0.006, 0.006)
    this.twinkle = this.type === 3
    this.twinklePhase = rand(0, Math.PI * 2)
    this.twinkleFreq = rand(0.04, 0.09)

    // Pre-build gradients
    if (this.type === 0) {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 2.2)
      g.addColorStop(0, this.color + "1)")
      g.addColorStop(0.4, this.color + "0.6)")
      g.addColorStop(1, this.color + "0)")
      this.grad = g
    } else if (this.type === 1) {
      this.grad = null
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 3)
      g.addColorStop(0, this.color + "0.3)")
      g.addColorStop(1, this.color + "0)")
      this.glowGrad = g
    } else if (this.type === 2) {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 1.8)
      g.addColorStop(0, this.color + "0.12)")
      g.addColorStop(1, this.color + "0)")
      this.glowGrad = g
    } else {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 2)
      g.addColorStop(0, this.color + "0.25)")
      g.addColorStop(1, this.color + "0)")
      this.glowGrad = g
    }
  }

  update(ctx: CanvasRenderingContext2D, t: number) {
    this.y += this.speed
    this.x += this.drift + Math.sin(t * this.driftFq + this.phase) * this.driftAmp
    this.rot += this.rotSpeed
    this.alpha += this.alphaDelta
    if (this.alpha > this.alphaTarget || this.alpha < 0.04) this.alphaDelta *= -1
    if (this.twinkle) this.twinklePhase += this.twinkleFreq
    if (this.y > this.H + 20 || this.x < -40 || this.x > this.W + 40) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const a = this.twinkle ? this.alpha * (0.5 + 0.5 * Math.sin(this.twinklePhase)) : this.alpha
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rot)
    ctx.globalAlpha = a

    if (this.type === 0) {
      ctx.fillStyle = this.grad!
      ctx.beginPath()
      ctx.arc(0, 0, this.r * 2.2, 0, Math.PI * 2)
      ctx.fill()
    } else if (this.type === 1) {
      ctx.fillStyle = this.color + "1)"
      ctx.beginPath()
      ctx.arc(0, 0, this.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = this.glowGrad!
      ctx.beginPath()
      ctx.arc(0, 0, this.r * 3, 0, Math.PI * 2)
      ctx.fill()
    } else if (this.type === 2) {
      // Hex lines (no gradient needed)
      const angle = Math.PI / 3
      ctx.strokeStyle = this.color + "0.9)"
      ctx.lineWidth = 0.6
      for (let i = 0; i < 6; i++) {
        const a2 = i * angle
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(a2) * this.r, Math.sin(a2) * this.r)
        ctx.stroke()
        const bx = Math.cos(a2) * this.r * 0.55,
          by = Math.sin(a2) * this.r * 0.55,
          bL = this.r * 0.28
        ctx.beginPath()
        ctx.moveTo(bx + Math.cos(a2 + Math.PI / 2) * bL, by + Math.sin(a2 + Math.PI / 2) * bL)
        ctx.lineTo(bx - Math.cos(a2 + Math.PI / 2) * bL, by - Math.sin(a2 + Math.PI / 2) * bL)
        ctx.stroke()
      }
      ctx.fillStyle = this.color + "0.8)"
      ctx.beginPath()
      ctx.arc(0, 0, 0.8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = this.glowGrad!
      ctx.beginPath()
      ctx.arc(0, 0, this.r * 1.8, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Sparkle lines
      ctx.strokeStyle = this.color + "0.85)"
      ctx.lineWidth = 0.7
      for (let i = 0; i < 4; i++) {
        const a2 = (i / 4) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(a2) * this.r, Math.sin(a2) * this.r)
        ctx.stroke()
      }
      for (let i = 0; i < 4; i++) {
        const a2 = (i / 4) * Math.PI * 2 + Math.PI / 4
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(a2) * this.r * 0.55, Math.sin(a2) * this.r * 0.55)
        ctx.stroke()
      }
      ctx.fillStyle = this.glowGrad!
      ctx.beginPath()
      ctx.arc(0, 0, this.r * 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
}

export function runSnow(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const particles: Flake[] = []
  for (let i = 0; i < COUNT; i++) particles.push(new Flake(ctx, W, H, true))

  let t = 0
  let raf = 0

  function render() {
    ctx.clearRect(0, 0, W, H)
    t++
    for (const p of particles) {
      p.update(ctx, t)
      p.draw(ctx)
    }
    raf = requestAnimationFrame(render)
  }
  render()

  return () => cancelAnimationFrame(raf)
}
