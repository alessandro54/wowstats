function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

// Palette: purple, pink, blue arcane
const COLORS = [
  {
    r: 160,
    g: 60,
    b: 255,
  }, // vivid purple
  {
    r: 220,
    g: 80,
    b: 240,
  }, // pink-purple
  {
    r: 80,
    g: 120,
    b: 255,
  }, // arcane blue
  {
    r: 200,
    g: 100,
    b: 255,
  }, // violet
  {
    r: 255,
    g: 100,
    b: 200,
  }, // hot pink
]

class ArcaneOrb {
  x = 0
  y = 0
  baseX = 0
  baseY = 0
  r = 0
  alpha = 0
  driftPh = 0
  driftFq = 0
  driftAmp = 0
  flickPh = 0
  flickFq = 0
  colorIdx = 0
  W: number
  H: number
  grad: CanvasGradient | null = null

  constructor(ctx: CanvasRenderingContext2D, W: number, H: number) {
    this.W = W
    this.H = H
    this.reset(ctx)
  }

  reset(ctx: CanvasRenderingContext2D) {
    this.baseX = rand(this.W * 0.05, this.W * 0.95)
    this.baseY = rand(this.H * 0.05, this.H * 0.9)
    this.x = this.baseX
    this.y = this.baseY
    this.r = rand(6, 28)
    this.alpha = rand(0.06, 0.22)
    this.driftPh = rand(0, Math.PI * 2)
    this.driftFq = rand(0.004, 0.012)
    this.driftAmp = rand(15, 50)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.03, 0.09)
    this.colorIdx = Math.floor(Math.random() * COLORS.length)

    const c = COLORS[this.colorIdx]
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r)
    g.addColorStop(0, `rgba(255,255,255,0.9)`)
    g.addColorStop(0.2, `rgba(${c.r},${c.g},${c.b},0.75)`)
    g.addColorStop(
      0.6,
      `rgba(${Math.floor(c.r * 0.5)},${Math.floor(c.g * 0.5)},${Math.floor(c.b * 0.5)},0.25)`,
    )
    g.addColorStop(1, `rgba(0,0,0,0)`)
    this.grad = g
  }

  update() {
    this.driftPh += this.driftFq
    this.flickPh += this.flickFq
    this.x = this.baseX + Math.sin(this.driftPh) * this.driftAmp
    this.y = this.baseY + Math.cos(this.driftPh * 0.7) * this.driftAmp * 0.6
  }

  draw(ctx: CanvasRenderingContext2D) {
    const flick = 0.7 + 0.3 * Math.abs(Math.sin(this.flickPh))
    const a = this.alpha * flick
    if (a < 0.01) return
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.driftPh * 0.4) // slow spin
    ctx.globalAlpha = a
    // Soft glow halo (circle)
    ctx.fillStyle = this.grad!
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, Math.PI * 2)
    ctx.fill()
    // Sharp diamond core
    const c = COLORS[this.colorIdx]
    ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.85)`
    ctx.beginPath()
    ctx.moveTo(0, -this.r * 0.65)
    ctx.lineTo(this.r * 0.38, 0)
    ctx.lineTo(0, this.r * 0.65)
    ctx.lineTo(-this.r * 0.38, 0)
    ctx.closePath()
    ctx.fill()
    // Bright white center glint
    ctx.fillStyle = "rgba(255,255,255,0.9)"
    ctx.beginPath()
    ctx.moveTo(0, -this.r * 0.18)
    ctx.lineTo(this.r * 0.1, 0)
    ctx.lineTo(0, this.r * 0.18)
    ctx.lineTo(-this.r * 0.1, 0)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}

class ArcaneMote {
  x = 0
  y = 0
  baseX = 0
  baseY = 0
  r = 0
  alpha = 0
  driftPh = 0
  driftFq = 0
  flickPh = 0
  flickFq = 0
  W: number
  H: number
  grad: CanvasGradient | null = null

  constructor(ctx: CanvasRenderingContext2D, W: number, H: number) {
    this.W = W
    this.H = H
    this.reset(ctx)
  }

  reset(ctx: CanvasRenderingContext2D) {
    this.baseX = rand(0, this.W)
    this.baseY = rand(0, this.H)
    this.x = this.baseX
    this.y = this.baseY
    this.r = rand(0.5, 2.0)
    this.alpha = rand(0.15, 0.5)
    this.driftPh = rand(0, Math.PI * 2)
    this.driftFq = rand(0.008, 0.02)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.05, 0.15)

    const c = COLORS[Math.floor(Math.random() * COLORS.length)]
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 4)
    g.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.8)`)
    g.addColorStop(1, `rgba(0,0,0,0)`)
    this.grad = g
  }

  update() {
    this.driftPh += this.driftFq
    this.flickPh += this.flickFq
    this.x = this.baseX + Math.sin(this.driftPh) * 20
    this.y = this.baseY + Math.cos(this.driftPh * 0.6) * 15
  }

  draw(ctx: CanvasRenderingContext2D) {
    const a = this.alpha * (0.55 + 0.45 * Math.abs(Math.sin(this.flickPh)))
    if (a < 0.01) return
    const s = this.r * 3
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.driftPh * 0.6)
    ctx.globalAlpha = a
    ctx.fillStyle = this.grad!
    ctx.beginPath()
    ctx.arc(0, 0, s, 0, Math.PI * 2)
    ctx.fill()
    // Small sharp diamond
    ctx.fillStyle = "rgba(220,200,255,0.9)"
    ctx.beginPath()
    ctx.moveTo(0, -s * 0.5)
    ctx.lineTo(s * 0.28, 0)
    ctx.lineTo(0, s * 0.5)
    ctx.lineTo(-s * 0.28, 0)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}

export function runArcaneOrbs(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const orbs = Array.from(
    {
      length: 18,
    },
    () => new ArcaneOrb(ctx, W, H),
  )
  const motes = Array.from(
    {
      length: 60,
    },
    () => new ArcaneMote(ctx, W, H),
  )

  let bgPh = 0
  let raf = 0

  function drawAmbient() {
    bgPh += 0.005
    const pulse = 0.5 + 0.5 * Math.sin(bgPh)
    const g = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, W * 0.7)
    g.addColorStop(0, `rgba(60,0,120,${0.03 + pulse * 0.02})`)
    g.addColorStop(0.5, `rgba(30,0,70,${0.015 + pulse * 0.01})`)
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }

  function render() {
    ctx.clearRect(0, 0, W, H)
    drawAmbient()
    for (const m of motes) {
      m.update()
      m.draw(ctx)
    }
    for (const o of orbs) {
      o.update()
      o.draw(ctx)
    }
    raf = requestAnimationFrame(render)
  }
  render()

  return () => cancelAnimationFrame(raf)
}
