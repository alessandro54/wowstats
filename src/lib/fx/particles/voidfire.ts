function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

class VoidFlame {
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
    this.r = rand(20, 60)
    this.vy = rand(-1.5, -3.2)
    this.vx = rand(-0.25, 0.25)
    this.maxLife = rand(45, 95)
    this.life = fresh ? rand(0, this.maxLife) : 0
    this.alpha = rand(0.1, 0.28)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.1, 0.25)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r)
    g.addColorStop(0, "rgba(200,160,255,0.85)")
    g.addColorStop(0.3, "rgba(100,40,220,0.6)")
    g.addColorStop(0.65, "rgba(20,0,80,0.3)")
    g.addColorStop(1, "rgba(0,0,0,0)")
    this.grad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.life++
    this.y += this.vy
    this.x += this.vx + rand(-0.12, 0.12)
    this.flickPh += this.flickFq
    const p = this.life / this.maxLife
    if (p < 0.15) this.alpha = this.alpha * (p / 0.15)
    else if (p > 0.55) this.alpha *= 0.978
    if (this.life >= this.maxLife || this.y < -this.r * 2) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const flick = 0.75 + 0.25 * Math.abs(Math.sin(this.flickPh))
    const a = this.alpha * flick
    if (a < 0.005) return
    ctx.save()
    ctx.globalAlpha = a
    ctx.translate(this.x, this.y)
    ctx.scale(1, 1.7)
    ctx.fillStyle = this.grad!
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

class VoidMote {
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
    this.y = fresh ? rand(this.H * 0.4, this.H) : this.H + rand(0, 10)
    this.r = rand(1.0, 3.0)
    this.vx = rand(-0.4, 0.4)
    this.vy = rand(-0.5, -1.8)
    this.alpha = rand(0.25, 0.65)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.06, 0.18)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 4)
    g.addColorStop(0, "rgba(180,100,255,0.85)")
    g.addColorStop(0.5, "rgba(60,0,160,0.35)")
    g.addColorStop(1, "rgba(0,0,0,0)")
    this.grad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.x += this.vx + rand(-0.08, 0.08)
    this.y += this.vy
    this.alpha *= 0.994
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
    ctx.arc(0, 0, this.r * 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "rgba(220,180,255,1)"
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

export function runVoidFire(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const flames = Array.from(
    {
      length: 25,
    },
    () => new VoidFlame(ctx, W, H, true),
  )
  const motes = Array.from(
    {
      length: 40,
    },
    () => new VoidMote(ctx, W, H, true),
  )

  let bgPh = 0
  let raf = 0

  function drawGlow() {
    bgPh += 0.007
    const pulse = 0.5 + 0.5 * Math.sin(bgPh)
    const g = ctx.createLinearGradient(0, H, 0, H * 0.5)
    g.addColorStop(0, `rgba(40,0,100,${0.08 + pulse * 0.05})`)
    g.addColorStop(0.5, `rgba(20,0,50,${0.03 + pulse * 0.02})`)
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
    for (const m of motes) {
      m.update(ctx)
      m.draw(ctx)
    }
    raf = requestAnimationFrame(render)
  }
  render()

  return () => cancelAnimationFrame(raf)
}
