function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

const RAIN_ANGLE_DEG = -15
const RAD = (RAIN_ANGLE_DEG * Math.PI) / 180
const DIR_X = Math.sin(RAD)
const DIR_Y = Math.cos(RAD)

class StarShard {
  x = 0
  y = 0
  vx = 0
  vy = 0
  r = 0
  alpha = 0
  trail: {
    x: number
    y: number
  }[] = []
  flickPh = 0
  flickFq = 0
  W: number
  H: number
  bloomGrad: CanvasGradient | null = null

  constructor(ctx: CanvasRenderingContext2D, W: number, H: number, fresh: boolean) {
    this.W = W
    this.H = H
    this.reset(ctx, fresh)
  }

  reset(ctx: CanvasRenderingContext2D, fresh: boolean) {
    const spd = rand(2.5, 5.0)
    this.vx = DIR_X * spd
    this.vy = DIR_Y * spd
    this.r = rand(1.0, 2.8)

    if (fresh) {
      this.x = rand(-this.W * 0.2, this.W * 1.1)
      this.y = rand(-this.H * 0.1, this.H * 0.8)
    } else {
      if (Math.random() < 0.65) {
        this.x = rand(-this.W * 0.15, this.W * 1.1)
        this.y = rand(-100, -10)
      } else {
        this.x = rand(this.W * 0.6, this.W * 1.3)
        this.y = rand(-this.H * 0.15, this.H * 0.1)
      }
    }
    this.alpha = rand(0.3, 0.65)
    this.trail = []
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.1, 0.25)

    const bloom = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 7)
    const t = Math.random()
    if (t < 0.33) {
      // gold/silver — Elune starfall
      bloom.addColorStop(0, "rgba(255,240,180,0.7)")
      bloom.addColorStop(0.3, "rgba(200,180,255,0.25)")
      bloom.addColorStop(1, "rgba(0,0,0,0)")
    } else if (t < 0.66) {
      // cool blue cosmic
      bloom.addColorStop(0, "rgba(160,200,255,0.65)")
      bloom.addColorStop(0.3, "rgba(80,120,240,0.2)")
      bloom.addColorStop(1, "rgba(0,0,0,0)")
    } else {
      // purple arcane
      bloom.addColorStop(0, "rgba(200,160,255,0.65)")
      bloom.addColorStop(0.3, "rgba(120,60,220,0.2)")
      bloom.addColorStop(1, "rgba(0,0,0,0)")
    }
    this.bloomGrad = bloom
  }

  update(ctx: CanvasRenderingContext2D) {
    this.trail.push({
      x: this.x,
      y: this.y,
    })
    if (this.trail.length > 12) this.trail.shift()
    this.x += this.vx
    this.y += this.vy
    this.flickPh += this.flickFq
    const fadeZone = this.H * 0.15
    if (this.y > this.H - fadeZone) this.alpha = Math.max(0, this.alpha - 0.04)
    if (this.y > this.H + 20 || this.x < -this.W * 0.25 || this.alpha <= 0) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const tLen = this.trail.length
    if (tLen < 2) return
    const flick = 0.8 + 0.2 * Math.abs(Math.sin(this.flickPh))

    for (let i = 1; i < tLen; i++) {
      const frac = i / tLen
      const a = frac * this.alpha * 0.6 * flick
      if (a < 0.005) continue
      ctx.globalAlpha = a
      ctx.lineWidth = this.r * frac * 1.2
      ctx.lineCap = "round"
      ctx.strokeStyle = `rgba(${Math.floor(200 + frac * 55)},${Math.floor(200 + frac * 40)},255,1)`
      ctx.beginPath()
      ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y)
      ctx.lineTo(this.trail[i].x, this.trail[i].y)
      ctx.stroke()
    }

    const hx = this.trail[tLen - 1]?.x ?? this.x
    const hy = this.trail[tLen - 1]?.y ?? this.y
    ctx.save()
    ctx.translate(hx, hy)
    ctx.globalAlpha = this.alpha * flick
    ctx.fillStyle = this.bloomGrad!
    ctx.beginPath()
    ctx.arc(0, 0, this.r * 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "rgba(255,255,230,1)"
    ctx.beginPath()
    ctx.arc(0, 0, this.r * 0.6, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

class CosmicDust {
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
    this.y = fresh ? rand(-this.H * 0.1, this.H * 0.9) : rand(-80, -5)
    this.r = rand(0.4, 1.5)
    this.vx = DIR_X * rand(0.4, 1.2)
    this.vy = DIR_Y * rand(0.4, 1.2)
    this.alpha = rand(0.1, 0.45)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.04, 0.14)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 5)
    g.addColorStop(0, "rgba(220,210,255,0.9)")
    g.addColorStop(1, "rgba(80,50,180,0)")
    this.grad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.x += this.vx
    this.y += this.vy
    this.alpha *= 0.997
    this.flickPh += this.flickFq
    if (this.y > this.H + 10 || this.alpha < 0.02) this.reset(ctx, false)
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
    ctx.fillStyle = "rgba(240,235,255,1)"
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

export function runRainOfStars(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const stars = Array.from(
    {
      length: 14,
    },
    () => new StarShard(ctx, W, H, true),
  )
  const dust = Array.from(
    {
      length: 50,
    },
    () => new CosmicDust(ctx, W, H, true),
  )

  let bgPh = 0
  let raf = 0

  function drawDynBg() {
    bgPh += 0.003
    const pulse = 0.5 + 0.5 * Math.sin(bgPh)
    const g = ctx.createLinearGradient(0, 0, 0, H * 0.45)
    g.addColorStop(0, `rgba(20,10,60,${0.05 + pulse * 0.03})`)
    g.addColorStop(0.5, `rgba(10,5,30,${0.02 + pulse * 0.01})`)
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }

  function render() {
    ctx.clearRect(0, 0, W, H)
    drawDynBg()
    for (const d of dust) {
      d.update(ctx)
      d.draw(ctx)
    }
    for (const s of stars) {
      s.update(ctx)
      s.draw(ctx)
    }
    raf = requestAnimationFrame(render)
  }
  render()

  return () => cancelAnimationFrame(raf)
}
