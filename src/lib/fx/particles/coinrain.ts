function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

const ANGLE_DEG = 22
const RAD = (ANGLE_DEG * Math.PI) / 180
const DIR_X = Math.sin(RAD)
const DIR_Y = Math.cos(RAD)

/* ── Coin colors ──────────────────────────────────────────── */

const FACE_COLORS = [
  "#c8a020",
  "#b87808",
  "#986030",
  "#b0a898",
] as const
const EDGE_COLORS = [
  "#806010",
  "#704008",
  "#583018",
  "#787068",
] as const

function pickType(): number {
  const t = Math.random()
  if (t < 0.55) return 0 // gold
  if (t < 0.78) return 1 // amber
  if (t < 0.91) return 2 // copper
  return 3 // silver
}

/* ── Coin ─────────────────────────────────────────────────── */

class Coin {
  x = 0
  y = 0
  vx = 0
  vy = 0
  r = 0
  rotAng = 0
  rotSpd = 0
  wobble = 0
  wobSpd = 0
  alpha = 0
  type = 0
  W: number
  H: number

  constructor(W: number, H: number, fresh: boolean) {
    this.W = W
    this.H = H
    this.reset(fresh)
  }

  reset(fresh: boolean) {
    const spd = rand(0.8, 2.6)
    this.vx = DIR_X * spd
    this.vy = DIR_Y * spd

    if (fresh) {
      this.x = rand(-this.W * 0.15, this.W * 1.1)
      this.y = rand(-this.H * 0.1, this.H * 0.85)
    } else if (Math.random() < 0.65) {
      this.x = rand(-this.W * 0.15, this.W * 1.1)
      this.y = rand(-120, -20)
    } else {
      this.x = rand(this.W * 0.6, this.W * 1.2)
      this.y = rand(-this.H * 0.15, this.H * 0.2)
    }

    this.r = rand(3, 10)
    this.rotAng = rand(0, Math.PI * 2)
    this.rotSpd = rand(0.015, 0.045) * (Math.random() < 0.5 ? 1 : -1)
    this.wobble = rand(0, Math.PI * 2)
    this.wobSpd = rand(0.008, 0.025)
    this.alpha = rand(0.15, 0.5)
    this.type = pickType()
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.rotAng += this.rotSpd
    this.wobble += this.wobSpd

    const fadeZone = this.H * 0.15
    if (this.y > this.H - fadeZone) {
      this.alpha = Math.max(0, this.alpha - 0.018)
    }

    if (
      this.y > this.H + 30 ||
      this.x < -this.W * 0.3 ||
      this.x > this.W * 1.3 ||
      this.alpha <= 0
    ) {
      this.reset(false)
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Use sin² to get a smooth 0→1→0 pulse that never goes negative.
    // This is the "width" of the coin as it spins — always positive, no sign flips.
    const sinHalf = Math.sin(this.rotAng)
    const xScale = sinHalf * sinHalf
    // Clamp so the coin never collapses below 18% width
    const clamped = 0.18 + xScale * 0.82
    const r = this.r
    const rx = r * clamped
    const ry = r

    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(Math.sin(this.wobble) * 0.08)
    ctx.globalAlpha = this.alpha

    // Single solid ellipse — face color when wide, edge color when thin
    const face = FACE_COLORS[this.type]
    const edge = EDGE_COLORS[this.type]

    if (clamped < 0.35) {
      // Thin / edge-on: just the edge color
      ctx.fillStyle = edge
      ctx.beginPath()
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Rim (slightly larger, darker)
      ctx.fillStyle = edge
      ctx.beginPath()
      ctx.ellipse(0, 0.5, rx + 0.6, ry + 0.6, 0, 0, Math.PI * 2)
      ctx.fill()

      // Face
      ctx.fillStyle = face
      ctx.beginPath()
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
      ctx.fill()

      // Subtle highlight — just a lighter arc, no gradients
      if (clamped > 0.5) {
        ctx.globalAlpha = this.alpha * (clamped - 0.5) * 0.4
        ctx.fillStyle = "rgba(255,255,230,0.35)"
        ctx.beginPath()
        ctx.ellipse(-rx * 0.25, -ry * 0.25, rx * 0.5, ry * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.restore()
  }
}

/* ── Dust mote ────────────────────────────────────────────── */

class Mote {
  x = 0
  y = 0
  r = 0
  vx = 0
  vy = 0
  alpha = 0
  alphaDelta = 0
  ph = 0
  fq = 0
  W: number
  H: number
  grad: CanvasGradient | null = null

  constructor(ctx: CanvasRenderingContext2D, W: number, H: number, fresh: boolean) {
    this.W = W
    this.H = H
    this.reset(ctx, fresh)
  }

  reset(ctx: CanvasRenderingContext2D, fresh: boolean) {
    this.x = rand(0, this.W)
    this.y = fresh ? rand(0, this.H) : this.H + rand(0, 20)
    this.r = rand(0.4, 1.4)
    this.vy = rand(-0.08, -0.25)
    this.vx = rand(-0.06, 0.06)
    this.alpha = rand(0.04, 0.18)
    this.alphaDelta = (Math.random() < 0.5 ? 1 : -1) * rand(0.0008, 0.002)
    this.ph = rand(0, Math.PI * 2)
    this.fq = rand(0.005, 0.015)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 3)
    g.addColorStop(0, "rgba(200,160,40,0.5)")
    g.addColorStop(1, "rgba(120,80,0,0)")
    this.grad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.y += this.vy
    this.ph += this.fq
    this.x += this.vx + Math.sin(this.ph) * 0.12
    this.alpha += this.alphaDelta
    if (this.alpha > 0.18 || this.alpha < 0.02) this.alphaDelta *= -1
    if (this.y < -10 || this.x < -10 || this.x > this.W + 10) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha < 0.01) return
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.grad!
    ctx.beginPath()
    ctx.arc(0, 0, this.r * 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

/* ── Ground glimmer pool ──────────────────────────────────── */

class GlimmerPool {
  x = 0
  rx = 0
  ry = 0
  alpha = 0
  target = 0
  life = 0
  maxLife = 0
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
    this.x = rand(this.W * 0.05, this.W * 0.95)
    this.rx = rand(12, 40)
    this.ry = this.rx * rand(0.08, 0.14)
    this.alpha = 0
    this.target = rand(0.05, 0.18)
    this.life = 0
    this.maxLife = rand(200, 650)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.01, 0.03)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.rx)
    g.addColorStop(0, "rgba(200,150,0,0.7)")
    g.addColorStop(0.5, "rgba(160,100,0,0.25)")
    g.addColorStop(1, "rgba(100,60,0,0)")
    this.grad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.life++
    this.flickPh += this.flickFq
    const p = this.life / this.maxLife
    if (p < 0.1) this.alpha = this.target * (p / 0.1)
    else if (p < 0.75) this.alpha = this.target
    else this.alpha = this.target * (1 - (p - 0.75) / 0.25)
    if (this.life >= this.maxLife) this.reset(ctx)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const flick = 0.75 + 0.25 * Math.abs(Math.sin(this.flickPh))
    const a = this.alpha * flick
    if (a < 0.004) return
    ctx.save()
    ctx.globalAlpha = a
    const yb = this.H - this.ry * 0.5
    ctx.translate(this.x, yb)
    ctx.fillStyle = this.grad!
    ctx.beginPath()
    ctx.ellipse(0, 0, this.rx, this.ry, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

/* ── Main runner ──────────────────────────────────────────── */

export function runCoinRain(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const coins = Array.from(
    {
      length: 35,
    },
    () => new Coin(W, H, true),
  )
  const motes = Array.from(
    {
      length: 25,
    },
    () => new Mote(ctx, W, H, true),
  )
  const pools = Array.from(
    {
      length: 5,
    },
    () => {
      const p = new GlimmerPool(ctx, W, H)
      p.life = rand(0, p.maxLife)
      return p
    },
  )

  let bgPh = 0
  let raf = 0

  function drawDynBg() {
    bgPh += 0.003
    const pulse = 0.5 + 0.5 * Math.sin(bgPh)

    const g = ctx.createRadialGradient(W * 0.5, 0, 0, W * 0.5, 0, W * 0.5)
    g.addColorStop(0, `rgba(90,55,8,${0.04 + pulse * 0.03})`)
    g.addColorStop(0.5, `rgba(50,25,0,${0.01 + pulse * 0.01})`)
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    const gx = W * (0.25 + 0.5 * Math.sin(bgPh * 0.2))
    const gg = ctx.createRadialGradient(gx, H, 0, gx, H, W * 0.35)
    gg.addColorStop(0, `rgba(140,90,0,${0.025 + pulse * 0.02})`)
    gg.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = gg
    ctx.fillRect(0, 0, W, H)
  }

  function render() {
    ctx.clearRect(0, 0, W, H)
    drawDynBg()

    for (const m of motes) {
      m.update(ctx)
      m.draw(ctx)
    }
    for (const p of pools) {
      p.update(ctx)
      p.draw(ctx)
    }
    for (const c of coins) {
      c.update()
      c.draw(ctx)
    }

    raf = requestAnimationFrame(render)
  }
  render()

  return () => cancelAnimationFrame(raf)
}
