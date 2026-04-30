function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

// God rays emanating from a point source near the top
class GodRay {
  angle = 0 // radians from straight down
  length = 0
  halfW = 0 // half-width at the tip
  alpha = 0
  flickPh = 0
  flickFq = 0
  sourceX: number
  sourceY: number
  W: number
  H: number
  grad: CanvasGradient | null = null

  constructor(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    sourceX: number,
    sourceY: number,
  ) {
    this.W = W
    this.H = H
    this.sourceX = sourceX
    this.sourceY = sourceY
    this.reset(ctx)
  }

  reset(ctx: CanvasRenderingContext2D) {
    // Spread rays across a wide arc downward (-70° to +70° from vertical)
    this.angle = rand(-1.2, 1.2)
    this.length = rand(this.H * 0.55, this.H * 1.1)
    this.halfW = rand(8, 40)
    this.alpha = rand(0.008, 0.025)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.003, 0.012)

    const dx = Math.sin(this.angle)
    const dy = Math.cos(this.angle)
    const ex = this.sourceX + dx * this.length
    const ey = this.sourceY + dy * this.length

    const g = ctx.createLinearGradient(this.sourceX, this.sourceY, ex, ey)
    g.addColorStop(0, "rgba(255,250,210,0.9)")
    g.addColorStop(0.25, "rgba(255,235,160,0.55)")
    g.addColorStop(0.6, "rgba(255,215,100,0.18)")
    g.addColorStop(1, "rgba(0,0,0,0)")
    this.grad = g
  }

  update() {
    this.flickPh += this.flickFq
  }

  draw(ctx: CanvasRenderingContext2D) {
    const flick = 0.65 + 0.35 * Math.abs(Math.sin(this.flickPh))
    const a = this.alpha * flick
    if (a < 0.005) return

    const dx = Math.sin(this.angle)
    const dy = Math.cos(this.angle)
    // Perpendicular direction for width
    const px = -dy
    const py = dx

    const ex = this.sourceX + dx * this.length
    const ey = this.sourceY + dy * this.length
    const hw = this.halfW

    ctx.save()
    ctx.globalAlpha = a
    ctx.fillStyle = this.grad!
    ctx.beginPath()
    // Thin wedge: point at source, fans out to halfW at tip
    ctx.moveTo(this.sourceX, this.sourceY)
    ctx.lineTo(ex + px * hw, ey + py * hw)
    ctx.lineTo(ex - px * hw, ey - py * hw)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}

class HolyMote {
  x = 0
  y = 0
  vy = 0
  alpha = 0
  flickPh = 0
  flickFq = 0
  r = 0
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
    this.y = fresh ? rand(0, this.H * 0.7) : rand(-20, 0)
    this.r = rand(0.5, 2.0)
    this.vy = rand(0.08, 0.5)
    this.alpha = rand(0.04, 0.12)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.03, 0.1)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 5)
    g.addColorStop(0, "rgba(255,252,220,0.9)")
    g.addColorStop(0.5, "rgba(255,220,100,0.3)")
    g.addColorStop(1, "rgba(0,0,0,0)")
    this.grad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.y += this.vy
    this.flickPh += this.flickFq
    if (this.y > this.H * 0.85 || this.alpha < 0.01) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const a = this.alpha * (0.6 + 0.4 * Math.abs(Math.sin(this.flickPh)))
    if (a < 0.01) return
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.globalAlpha = a
    ctx.fillStyle = this.grad!
    ctx.beginPath()
    ctx.arc(0, 0, this.r * 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

export function runHolyLight(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  // Source slightly off-center, above viewport
  const sourceX = W * rand(0.35, 0.65)
  const sourceY = -H * 0.05

  const rays = Array.from(
    {
      length: 12,
    },
    () => new GodRay(ctx, W, H, sourceX, sourceY),
  )
  const motes = Array.from(
    {
      length: 40,
    },
    () => new HolyMote(ctx, W, H, true),
  )

  let bgPh = 0
  let raf = 0

  function drawAmbient() {
    bgPh += 0.004
    const pulse = 0.5 + 0.5 * Math.sin(bgPh)
    const g = ctx.createRadialGradient(sourceX, sourceY, 0, sourceX, H * 0.5, W * 0.7)
    g.addColorStop(0, `rgba(255,240,160,${0.018 + pulse * 0.008})`)
    g.addColorStop(0.4, `rgba(200,160,40,${0.006 + pulse * 0.004})`)
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }

  function render() {
    ctx.clearRect(0, 0, W, H)
    drawAmbient()
    for (const r of rays) {
      r.update()
      r.draw(ctx)
    }
    for (const m of motes) {
      m.update(ctx)
      m.draw(ctx)
    }
    raf = requestAnimationFrame(render)
  }
  render()

  return () => cancelAnimationFrame(raf)
}
