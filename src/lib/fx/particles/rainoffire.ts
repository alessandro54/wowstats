function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

const RAIN_ANGLE_DEG = -25
const RAD = (RAIN_ANGLE_DEG * Math.PI) / 180
const DIR_X = Math.sin(RAD)
const DIR_Y = Math.cos(RAD)

class Fireball {
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
  isFel = false
  W: number
  H: number
  bloomGrad: CanvasGradient | null = null

  constructor(ctx: CanvasRenderingContext2D, W: number, H: number, fresh: boolean) {
    this.W = W
    this.H = H
    this.reset(ctx, fresh)
  }

  reset(ctx: CanvasRenderingContext2D, fresh: boolean) {
    this.isFel = Math.random() < 0.18
    const spd = rand(2.0, 4.2)
    this.vx = DIR_X * spd
    this.vy = DIR_Y * spd
    this.r = rand(1.4, 3.5)

    if (fresh) {
      if (Math.random() < 0.7) {
        this.x = rand(-this.W * 0.2, this.W * 1.1)
        this.y = rand(-this.H * 0.1, this.H * 0.8)
      } else {
        this.x = rand(this.W * 0.5, this.W * 1.3)
        this.y = rand(-this.H * 0.15, this.H * 0.3)
      }
    } else {
      if (Math.random() < 0.65) {
        this.x = rand(-this.W * 0.15, this.W * 1.15)
        this.y = rand(-100, -10)
      } else {
        this.x = rand(this.W * 0.7, this.W * 1.3)
        this.y = rand(-this.H * 0.15, this.H * 0.1)
      }
    }
    this.alpha = rand(0.25, 0.55)
    this.trail = []
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.12, 0.28)

    // Cache bloom gradient at origin — will be used with translate
    const bloom = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 5.5)
    if (this.isFel) {
      bloom.addColorStop(0, "rgba(90,255,20,0.48)")
      bloom.addColorStop(0.38, "rgba(30,180,0,0.14)")
      bloom.addColorStop(1, "rgba(0,60,0,0)")
    } else {
      bloom.addColorStop(0, "rgba(255,210,70,0.52)")
      bloom.addColorStop(0.32, "rgba(255,80,0,0.18)")
      bloom.addColorStop(0.68, "rgba(180,15,0,0.05)")
      bloom.addColorStop(1, "rgba(0,0,0,0)")
    }
    this.bloomGrad = bloom
  }

  update(ctx: CanvasRenderingContext2D) {
    this.trail.push({
      x: this.x,
      y: this.y,
    })
    if (this.trail.length > 16) this.trail.shift()
    this.x += this.vx
    this.y += this.vy
    this.flickPh += this.flickFq
    const fadeZone = this.H * 0.18
    if (this.y > this.H - fadeZone) this.alpha = Math.max(0, this.alpha - 0.04)
    if (this.y > this.H + 20 || this.x < -this.W * 0.25 || this.alpha <= 0) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const tLen = this.trail.length
    if (tLen < 2) return
    const flick = 0.78 + 0.22 * Math.abs(Math.sin(this.flickPh))

    // Trail lines — no gradients needed
    for (let i = 1; i < tLen; i++) {
      const frac = i / tLen
      const a = frac * this.alpha * 0.7 * flick
      if (a < 0.005) continue
      ctx.globalAlpha = a
      ctx.lineWidth = this.r * frac * 1.6
      ctx.lineCap = "round"
      ctx.strokeStyle = this.isFel ? "rgba(50,210,10,1)" : `rgba(255,${Math.floor(frac * 140)},0,1)`
      ctx.beginPath()
      ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y)
      ctx.lineTo(this.trail[i].x, this.trail[i].y)
      ctx.stroke()
    }

    // Head bloom — use cached gradient with save/translate
    const hx = this.trail[tLen - 1]?.x ?? this.x,
      hy = this.trail[tLen - 1]?.y ?? this.y
    ctx.save()
    ctx.translate(hx, hy)
    ctx.globalAlpha = this.alpha * flick
    ctx.fillStyle = this.bloomGrad!
    ctx.beginPath()
    ctx.arc(0, 0, this.r * 5.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = this.isFel ? "rgba(180,255,60,1)" : "rgba(255,245,190,1)"
    ctx.beginPath()
    ctx.arc(0, 0, this.r * 0.45, 0, Math.PI * 2)
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
  alphaDelta = 0
  flickPh = 0
  flickFq = 0
  isFel = false
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
    this.y = fresh ? rand(this.H * 0.5, this.H) : this.H + rand(0, 15)
    this.r = rand(0.6, 2.0)
    this.vx = rand(-0.2, 0.2)
    this.vy = rand(-0.25, -0.7)
    this.alpha = rand(0.04, 0.25)
    this.alphaDelta = (Math.random() < 0.5 ? 1 : -1) * rand(0.001, 0.003)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.06, 0.16)
    this.isFel = Math.random() < 0.15

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 4)
    if (this.isFel) {
      g.addColorStop(0, "rgba(70,230,15,0.7)")
      g.addColorStop(1, "rgba(0,70,0,0)")
    } else {
      g.addColorStop(0, "rgba(255,150,15,0.65)")
      g.addColorStop(1, "rgba(160,15,0,0)")
    }
    this.glowGrad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.x += this.vx + rand(-0.05, 0.05)
    this.y += this.vy
    this.alpha += this.alphaDelta
    if (this.alpha > 0.25 || this.alpha < 0.03) this.alphaDelta *= -1
    this.flickPh += this.flickFq
    if (this.y < -10 || this.x < -10 || this.x > this.W + 10) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const a = this.alpha * (0.55 + 0.45 * Math.abs(Math.sin(this.flickPh)))
    if (a < 0.01) return
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.globalAlpha = a
    ctx.fillStyle = this.glowGrad!
    ctx.beginPath()
    ctx.arc(0, 0, this.r * 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = this.isFel ? "rgba(130,255,40,1)" : "rgba(255,220,80,1)"
    ctx.beginPath()
    ctx.arc(0, 0, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

class Smoke {
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
    this.r = rand(35, 100)
    this.vy = rand(-0.08, -0.28)
    this.vx = rand(-0.06, 0.06)
    this.alpha = rand(0.01, 0.035)
    this.rot = rand(0, Math.PI * 2)
    this.rotSpd = rand(-0.0008, 0.0008)

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r)
    g.addColorStop(0, "rgba(28,8,5,0.7)")
    g.addColorStop(0.55, "rgba(18,5,3,0.25)")
    g.addColorStop(1, "rgba(0,0,0,0)")
    this.grad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.y += this.vy
    this.x += this.vx
    this.rot += this.rotSpd
    this.alpha *= 0.9985
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

class GroundPool {
  x = 0
  rx = 0
  ry = 0
  alpha = 0
  target = 0
  life = 0
  maxLife = 0
  flickPh = 0
  flickFq = 0
  isFel = false
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
    this.rx = rand(20, 65)
    this.ry = this.rx * rand(0.1, 0.2)
    this.alpha = 0
    this.target = rand(0.05, 0.16)
    this.life = 0
    this.maxLife = rand(220, 700)
    this.flickPh = rand(0, Math.PI * 2)
    this.flickFq = rand(0.015, 0.05)
    this.isFel = Math.random() < 0.15

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.rx)
    if (this.isFel) {
      g.addColorStop(0, "rgba(55,210,10,0.9)")
      g.addColorStop(0.45, "rgba(25,150,0,0.5)")
      g.addColorStop(1, "rgba(0,0,0,0)")
    } else {
      g.addColorStop(0, "rgba(255,130,0,0.9)")
      g.addColorStop(0.4, "rgba(210,45,0,0.45)")
      g.addColorStop(0.78, "rgba(130,8,0,0.12)")
      g.addColorStop(1, "rgba(0,0,0,0)")
    }
    this.grad = g
  }

  update(ctx: CanvasRenderingContext2D) {
    this.life++
    this.flickPh += this.flickFq
    const p = this.life / this.maxLife
    if (p < 0.12) this.alpha = this.target * (p / 0.12)
    else if (p < 0.72) this.alpha = this.target
    else this.alpha = this.target * (1 - (p - 0.72) / 0.28)
    if (this.life >= this.maxLife) this.reset(ctx)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const flick = 0.72 + 0.28 * Math.abs(Math.sin(this.flickPh))
    const a = this.alpha * flick
    if (a < 0.005) return
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

export function runRainOfFire(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const fireballs = Array.from(
    {
      length: 10,
    },
    () => new Fireball(ctx, W, H, true),
  )
  const embers = Array.from(
    {
      length: 30,
    },
    () => new Ember(ctx, W, H, true),
  )
  const smokes = Array.from(
    {
      length: 12,
    },
    () => new Smoke(ctx, W, H, true),
  )
  const pools = Array.from(
    {
      length: 4,
    },
    () => {
      const p = new GroundPool(ctx, W, H)
      p.life = rand(0, p.maxLife)
      return p
    },
  )

  let bgPh = 0
  let raf = 0

  function drawDynBg() {
    bgPh += 0.005
    const pulse = 0.5 + 0.5 * Math.sin(bgPh)
    const g = ctx.createLinearGradient(0, H, 0, H * 0.5)
    g.addColorStop(0, `rgba(150,35,0,${0.04 + pulse * 0.03})`)
    g.addColorStop(0.45, `rgba(70,12,0,${0.015 + pulse * 0.01})`)
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }

  function render() {
    ctx.clearRect(0, 0, W, H)
    drawDynBg()
    for (const s of smokes) {
      s.update(ctx)
      s.draw(ctx)
    }
    for (const p of pools) {
      p.update(ctx)
      p.draw(ctx)
    }
    for (const f of fireballs) {
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
