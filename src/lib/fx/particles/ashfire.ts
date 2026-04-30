function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

class AshFlame {
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
    this.r = rand(20, 58)
    this.vy = rand(-1.2, -2.8)
    this.vx = rand(-0.4, 0.4)
    this.maxLife = rand(50, 100)
    this.life = fresh ? rand(0, this.maxLife) : 0
    this.alpha = rand(0.09, 0.22)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.08, 0.22)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r)
    g.addColorStop(0, "rgba(220,200,180,0.85)") // warm ash white
    g.addColorStop(0.25, "rgba(150,100,70,0.6)") // dark ember
    g.addColorStop(0.6, "rgba(60,40,30,0.3)") // charcoal
    g.addColorStop(1, "rgba(0,0,0,0)")
    this.grad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.life++
    this.y += this.vy
    this.x += this.vx + rand(-0.2, 0.2)
    this.flickPh += this.flickFq
    const p = this.life / this.maxLife
    if (p < 0.15) this.alpha = this.alpha * (p / 0.15)
    else if (p > 0.55) this.alpha *= 0.978
    if (this.life >= this.maxLife || this.y < -this.r * 2) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const flick = 0.78 + 0.22 * Math.abs(Math.sin(this.flickPh))
    const a = this.alpha * flick
    if (a < 0.005) return
    ctx.save()
    ctx.globalAlpha = a
    ctx.translate(this.x, this.y)
    ctx.scale(1, 1.6)
    ctx.fillStyle = this.grad!
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

class AshFlake {
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
    this.y = fresh ? rand(0, this.H) : this.H + rand(0, 20)
    this.r = rand(0.6, 2.0)
    // Ash drifts more sideways and slower than embers
    this.vx = rand(-0.5, 0.5)
    this.vy = rand(-0.4, -1.4)
    this.alpha = rand(0.2, 0.55)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.04, 0.12)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 4)
    g.addColorStop(0, "rgba(200,180,160,0.9)")
    g.addColorStop(0.5, "rgba(100,80,60,0.35)")
    g.addColorStop(1, "rgba(0,0,0,0)")
    this.grad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.x += this.vx + rand(-0.15, 0.15)
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
    ctx.fillStyle = "rgba(210,195,180,1)"
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

class AshSmoke {
  x = 0
  y = 0
  r = 0
  vx = 0
  vy = 0
  alpha = 0
  rot = 0
  rotSpd = 0
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
    this.y = fresh ? rand(this.H * 0.4, this.H) : this.H + rand(0, 40)
    this.r = rand(40, 110)
    this.vy = rand(-0.1, -0.35)
    this.vx = rand(-0.08, 0.08)
    this.alpha = rand(0.025, 0.07)
    this.rot = rand(0, Math.PI * 2)
    this.rotSpd = rand(-0.001, 0.001)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r)
    g.addColorStop(0, "rgba(80,70,60,0.7)")
    g.addColorStop(0.5, "rgba(50,45,40,0.3)")
    g.addColorStop(1, "rgba(0,0,0,0)")
    this.grad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.y += this.vy
    this.x += this.vx
    this.rot += this.rotSpd
    this.alpha *= 0.9987
    if (this.y < -this.r * 2 || this.alpha < 0.004) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rot)
    ctx.fillStyle = this.grad!
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

export function runAshFire(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const flames = Array.from(
    {
      length: 22,
    },
    () => new AshFlame(ctx, W, H, true),
  )
  const flakes = Array.from(
    {
      length: 55,
    },
    () => new AshFlake(ctx, W, H, true),
  )
  const smokes = Array.from(
    {
      length: 14,
    },
    () => new AshSmoke(ctx, W, H, true),
  )

  let bgPh = 0
  let raf = 0

  function drawGlow() {
    bgPh += 0.006
    const pulse = 0.5 + 0.5 * Math.sin(bgPh)
    const g = ctx.createLinearGradient(0, H, 0, H * 0.55)
    g.addColorStop(0, `rgba(80,50,30,${0.06 + pulse * 0.03})`)
    g.addColorStop(0.5, `rgba(40,25,15,${0.025 + pulse * 0.015})`)
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }

  function render() {
    ctx.clearRect(0, 0, W, H)
    drawGlow()
    for (const s of smokes) {
      s.update(ctx)
      s.draw(ctx)
    }
    for (const f of flames) {
      f.update(ctx)
      f.draw(ctx)
    }
    for (const fl of flakes) {
      fl.update(ctx)
      fl.draw(ctx)
    }
    raf = requestAnimationFrame(render)
  }
  render()

  return () => cancelAnimationFrame(raf)
}
