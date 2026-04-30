function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

const RAIN_ANGLE_DEG = -20
const RAD = (RAIN_ANGLE_DEG * Math.PI) / 180
const DIR_X = Math.sin(RAD)
const DIR_Y = Math.cos(RAD)

class FrostShard {
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
    const spd = rand(2.2, 4.5)
    this.vx = DIR_X * spd
    this.vy = DIR_Y * spd
    this.r = rand(1.2, 3.2)

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
    this.alpha = rand(0.2, 0.5)
    this.trail = []
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.1, 0.25)

    const bloom = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 6)
    bloom.addColorStop(0, "rgba(200,235,255,0.6)")
    bloom.addColorStop(0.3, "rgba(100,180,255,0.2)")
    bloom.addColorStop(0.6, "rgba(40,100,200,0.07)")
    bloom.addColorStop(1, "rgba(0,0,0,0)")
    this.bloomGrad = bloom
  }

  update(ctx: CanvasRenderingContext2D) {
    this.trail.push({
      x: this.x,
      y: this.y,
    })
    if (this.trail.length > 14) this.trail.shift()
    this.x += this.vx
    this.y += this.vy
    this.flickPh += this.flickFq
    const fadeZone = this.H * 0.15
    if (this.y > this.H - fadeZone) this.alpha = Math.max(0, this.alpha - 0.045)
    if (this.y > this.H + 20 || this.x < -this.W * 0.25 || this.alpha <= 0) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const tLen = this.trail.length
    if (tLen < 2) return
    const flick = 0.8 + 0.2 * Math.abs(Math.sin(this.flickPh))

    for (let i = 1; i < tLen; i++) {
      const frac = i / tLen
      const a = frac * this.alpha * 0.65 * flick
      if (a < 0.005) continue
      ctx.globalAlpha = a
      ctx.lineWidth = this.r * frac * 1.4
      ctx.lineCap = "round"
      // Icy blue trail
      ctx.strokeStyle = `rgba(${Math.floor(140 + frac * 80)},${Math.floor(200 + frac * 35)},255,1)`
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
    ctx.arc(0, 0, this.r * 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "rgba(225,245,255,1)"
    ctx.beginPath()
    ctx.arc(0, 0, this.r * 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

class IceShard {
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
  glowGrad: CanvasGradient | null = null

  constructor(ctx: CanvasRenderingContext2D, W: number, H: number, fresh: boolean) {
    this.W = W
    this.H = H
    this.reset(ctx, fresh)
  }

  reset(ctx: CanvasRenderingContext2D, fresh: boolean) {
    this.x = rand(0, this.W)
    this.y = fresh ? rand(-this.H * 0.1, this.H * 0.9) : rand(-100, -10)
    this.r = rand(0.5, 1.8)
    this.vx = DIR_X * rand(0.5, 1.5)
    this.vy = DIR_Y * rand(0.5, 1.5)
    this.alpha = rand(0.15, 0.5)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.05, 0.15)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 4)
    g.addColorStop(0, "rgba(180,225,255,0.8)")
    g.addColorStop(1, "rgba(60,140,220,0)")
    this.glowGrad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.x += this.vx
    this.y += this.vy
    this.alpha *= 0.995
    this.flickPh += this.flickFq
    if (this.y > this.H + 10 || this.x > this.W + 10 || this.alpha < 0.02) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const a = this.alpha * (0.6 + 0.4 * Math.abs(Math.sin(this.flickPh)))
    if (a < 0.01) return
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.globalAlpha = a
    ctx.fillStyle = this.glowGrad!
    ctx.beginPath()
    ctx.arc(0, 0, this.r * 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "rgba(220,240,255,1)"
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

class IcePool {
  x = 0
  rx = 0
  ry = 0
  alpha = 0
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
    this.rx = rand(18, 55)
    this.ry = this.rx * rand(0.1, 0.18)
    this.alpha = 0
    this.life = 0
    this.maxLife = rand(280, 700)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.01, 0.04)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.rx)
    g.addColorStop(0, "rgba(160,220,255,0.85)")
    g.addColorStop(0.45, "rgba(80,160,230,0.45)")
    g.addColorStop(0.8, "rgba(30,80,160,0.1)")
    g.addColorStop(1, "rgba(0,0,0,0)")
    this.grad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.life++
    this.flickPh += this.flickFq
    const p = this.life / this.maxLife
    const target = rand(0.04, 0.12)
    if (p < 0.1) this.alpha = target * (p / 0.1)
    else if (p < 0.75) this.alpha = target
    else this.alpha = target * (1 - (p - 0.75) / 0.25)
    if (this.life >= this.maxLife) this.reset(ctx)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const flick = 0.8 + 0.2 * Math.abs(Math.sin(this.flickPh))
    const a = this.alpha * flick
    if (a < 0.004) return
    ctx.save()
    ctx.globalAlpha = a
    ctx.translate(this.x, this.H - this.ry * 0.5)
    ctx.fillStyle = this.grad!
    ctx.beginPath()
    ctx.ellipse(0, 0, this.rx, this.ry, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

export function runRainOfFrost(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const shards = Array.from(
    {
      length: 12,
    },
    () => new FrostShard(ctx, W, H, true),
  )
  const ice = Array.from(
    {
      length: 35,
    },
    () => new IceShard(ctx, W, H, true),
  )
  const pools = Array.from(
    {
      length: 4,
    },
    () => {
      const p = new IcePool(ctx, W, H)
      p.life = rand(0, p.maxLife)
      return p
    },
  )

  let bgPh = 0
  let raf = 0

  function drawDynBg() {
    bgPh += 0.004
    const pulse = 0.5 + 0.5 * Math.sin(bgPh)
    const g = ctx.createLinearGradient(0, 0, 0, H * 0.5)
    g.addColorStop(0, `rgba(20,60,120,${0.04 + pulse * 0.03})`)
    g.addColorStop(0.5, `rgba(10,30,80,${0.015 + pulse * 0.01})`)
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }

  function render() {
    ctx.clearRect(0, 0, W, H)
    drawDynBg()
    for (const p of pools) {
      p.update(ctx)
      p.draw(ctx)
    }
    for (const s of shards) {
      s.update(ctx)
      s.draw(ctx)
    }
    for (const i of ice) {
      i.update(ctx)
      i.draw(ctx)
    }
    raf = requestAnimationFrame(render)
  }
  render()

  return () => cancelAnimationFrame(raf)
}
