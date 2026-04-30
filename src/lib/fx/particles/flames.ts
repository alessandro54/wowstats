function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

class Flame {
  x = 0
  y = 0
  vy = 0
  vx = 0
  r = 0
  alpha = 0
  flickPh = 0
  flickFq = 0
  life = 0
  maxLife = 0
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
    this.y = fresh ? rand(this.H * 0.6, this.H + 20) : this.H + rand(0, 30)
    this.r = rand(18, 55)
    this.vy = rand(-1.8, -3.5)
    this.vx = rand(-0.3, 0.3)
    this.maxLife = rand(40, 90)
    this.life = fresh ? rand(0, this.maxLife) : 0
    this.alpha = rand(0.12, 0.32)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.12, 0.28)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r)
    g.addColorStop(0, "rgba(255,245,180,0.9)")
    g.addColorStop(0.25, "rgba(255,160,20,0.7)")
    g.addColorStop(0.6, "rgba(220,50,0,0.35)")
    g.addColorStop(1, "rgba(100,10,0,0)")
    this.grad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.life++
    this.y += this.vy
    this.x += this.vx + rand(-0.15, 0.15)
    this.flickPh += this.flickFq
    // Fade in then out
    const p = this.life / this.maxLife
    if (p < 0.15) this.alpha = this.alpha * (p / 0.15)
    else if (p > 0.55) this.alpha *= 0.975
    if (this.life >= this.maxLife || this.y < -this.r * 2) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const flick = 0.75 + 0.25 * Math.abs(Math.sin(this.flickPh))
    const a = this.alpha * flick
    if (a < 0.005) return
    ctx.save()
    ctx.globalAlpha = a
    ctx.translate(this.x, this.y)
    // Squish vertically to give flame shape
    ctx.scale(1, 1.6)
    ctx.fillStyle = this.grad!
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

class Ember {
  x = 0
  y = 0
  r = 0
  vx = 0
  vy = 0
  alpha = 0
  flickPh = 0
  flickFq = 0
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
    this.y = fresh ? rand(this.H * 0.5, this.H) : this.H + rand(0, 10)
    this.r = rand(0.8, 2.2)
    this.vx = rand(-0.6, 0.6)
    this.vy = rand(-0.8, -2.2)
    this.alpha = rand(0.3, 0.7)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.08, 0.2)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 3.5)
    g.addColorStop(0, "rgba(255,230,100,0.9)")
    g.addColorStop(0.5, "rgba(255,80,0,0.4)")
    g.addColorStop(1, "rgba(0,0,0,0)")
    this.grad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.x += this.vx + rand(-0.1, 0.1)
    this.y += this.vy
    this.alpha *= 0.993
    this.flickPh += this.flickFq
    if (this.y < -10 || this.alpha < 0.02) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const a = this.alpha * (0.6 + 0.4 * Math.abs(Math.sin(this.flickPh)))
    if (a < 0.01) return
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.globalAlpha = a
    ctx.fillStyle = this.grad!
    ctx.beginPath()
    ctx.arc(0, 0, this.r * 3.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "rgba(255,240,160,1)"
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

export function runFlames(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const flames = Array.from(
    {
      length: 28,
    },
    () => new Flame(ctx, W, H, true),
  )
  const embers = Array.from(
    {
      length: 45,
    },
    () => new Ember(ctx, W, H, true),
  )

  let bgPh = 0
  let raf = 0

  function drawGlow() {
    bgPh += 0.008
    const pulse = 0.5 + 0.5 * Math.sin(bgPh)
    const g = ctx.createLinearGradient(0, H, 0, H * 0.55)
    g.addColorStop(0, `rgba(180,50,0,${0.07 + pulse * 0.04})`)
    g.addColorStop(0.5, `rgba(100,20,0,${0.03 + pulse * 0.02})`)
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }

  function render() {
    ctx.clearRect(0, 0, W, H)
    drawGlow()
    for (const f of flames) {
      f.update(ctx)
      f.draw(ctx)
    }
    for (const e of embers) {
      e.update(ctx)
      e.draw(ctx)
    }
    raf = requestAnimationFrame(render)
  }
  render()

  return () => cancelAnimationFrame(raf)
}
