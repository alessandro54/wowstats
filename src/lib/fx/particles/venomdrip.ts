function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

// ── Splash rings on drop landing ──────────────────────────────
interface Splash {
  x: number
  y: number
  r: number
  maxR: number
  life: number
  maxL: number
}

const splashes: Splash[] = []

function spawnSplash(x: number, y: number, r: number) {
  splashes.push({
    x,
    y,
    r,
    maxR: r * rand(4, 7),
    life: 0,
    maxL: rand(35, 60),
  })
}

function updateSplashes(ctx: CanvasRenderingContext2D, _H: number) {
  for (let i = splashes.length - 1; i >= 0; i--) {
    const s = splashes[i]
    s.life++
    const p = s.life / s.maxL
    s.r += (s.maxR - s.r) * 0.12
    const alpha = (1 - p) * 0.15
    if (alpha < 0.003 || s.life >= s.maxL) {
      splashes.splice(i, 1)
      continue
    }
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.strokeStyle = "rgba(100,220,20,1)"
    ctx.lineWidth = Math.max(0.4, 1.2 * (1 - p))
    ctx.beginPath()
    ctx.ellipse(s.x, s.y, s.r, s.r * 0.28, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
}

// ── Venom drop ───────────────────────────────────────────────
class Drop {
  x = 0
  y = 0
  r = 0
  vy = 0
  acc = 0
  vx = 0
  alpha = 0
  tail = 0
  landed = false
  W: number
  H: number

  constructor(W: number, H: number, fresh: boolean) {
    this.W = W
    this.H = H
    this.reset(fresh)
  }

  reset(fresh: boolean) {
    this.x = rand(this.W * 0.04, this.W * 0.96)
    this.y = fresh ? rand(-this.H, this.H * 0.3) : rand(-80, -10)
    this.r = rand(2, 6)
    this.vy = rand(0.1, 0.35)
    this.acc = rand(0.001, 0.004)
    this.vx = rand(-0.08, 0.08)
    this.alpha = rand(0.15, 0.35)
    this.tail = rand(1.4, 2.2)
    this.landed = false
  }

  update() {
    this.vy += this.acc
    this.y += this.vy
    this.x += this.vx
    const fadeZone = this.H * 0.1
    if (this.y > this.H - fadeZone) {
      this.alpha = Math.max(0, this.alpha - 0.04)
    }
    if (this.y > this.H - this.r * 2 && !this.landed) {
      this.landed = true
      spawnSplash(this.x, this.H - 4, this.r)
    }
    if (this.y > this.H + 20 || this.alpha <= 0) this.reset(false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.translate(this.x, this.y)
    const r = this.r
    const tl = r * this.tail

    // Outer glow
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.4)
    glow.addColorStop(0, "rgba(80,200,10,0.12)")
    glow.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(0, 0, r * 2.4, 0, Math.PI * 2)
    ctx.fill()

    // Teardrop body
    ctx.beginPath()
    ctx.moveTo(0, r)
    ctx.bezierCurveTo(r * 0.95, r * 0.2, r * 0.7, -tl * 0.5, 0, -tl)
    ctx.bezierCurveTo(-r * 0.7, -tl * 0.5, -r * 0.95, r * 0.2, 0, r)
    ctx.closePath()

    const fill = ctx.createRadialGradient(-r * 0.25, -r * 0.3, 0, 0, 0, r * 1.1)
    fill.addColorStop(0, "#c0f040")
    fill.addColorStop(0.45, "#7acc22")
    fill.addColorStop(1, "#2a6608")
    ctx.fillStyle = fill
    ctx.fill()

    // Glint highlight
    ctx.save()
    ctx.clip()
    const hi = ctx.createRadialGradient(-r * 0.3, -r * 0.5, 0, -r * 0.3, -r * 0.5, r * 0.7)
    hi.addColorStop(0, "rgba(220,255,160,0.55)")
    hi.addColorStop(1, "rgba(220,255,160,0)")
    ctx.fillStyle = hi
    ctx.beginPath()
    ctx.arc(0, 0, r * 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    ctx.restore()
  }
}

// ── Toxic pool ───────────────────────────────────────────────
class Pool {
  x = 0
  rx = 0
  ry = 0
  life = 0
  maxL = 0
  ph = 0
  fq = 0
  alpha = 0
  peak = 0
  W: number
  H: number

  constructor(W: number, H: number) {
    this.W = W
    this.H = H
    this.reset()
  }

  reset() {
    this.x = rand(this.W * 0.06, this.W * 0.94)
    this.rx = rand(20, 65)
    this.ry = this.rx * rand(0.07, 0.14)
    this.life = 0
    this.maxL = rand(300, 800)
    this.ph = rand(0, Math.PI * 2)
    this.fq = rand(0.01, 0.025)
    this.alpha = 0
    this.peak = rand(0.08, 0.18)
  }

  update() {
    this.life++
    this.ph += this.fq
    const p = this.life / this.maxL
    if (p < 0.08) this.alpha = this.peak * (p / 0.08)
    else if (p < 0.78) this.alpha = this.peak
    else this.alpha = this.peak * (1 - (p - 0.78) / 0.22)
    if (this.life >= this.maxL) this.reset()
  }

  draw(ctx: CanvasRenderingContext2D) {
    const flick = 0.75 + 0.25 * Math.abs(Math.sin(this.ph))
    const a = this.alpha * flick
    if (a < 0.005) return
    ctx.save()
    ctx.globalAlpha = a
    const yb = this.H - this.ry * 0.5
    const g = ctx.createRadialGradient(this.x, yb, 0, this.x, yb, this.rx)
    g.addColorStop(0, "rgba(100,220,10,0.5)")
    g.addColorStop(0.4, "rgba(60,150,6,0.2)")
    g.addColorStop(1, "rgba(10,50,2,0)")
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(this.x, yb, this.rx, this.ry, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

// ── Rising fume ──────────────────────────────────────────────
class Fume {
  x = 0
  y = 0
  r = 0
  maxR = 0
  vy = 0
  vx = 0
  ph = 0
  fq = 0
  life = 0
  maxL = 0
  alpha = 0
  peak = 0
  W: number
  H: number

  constructor(W: number, H: number, fresh: boolean) {
    this.W = W
    this.H = H
    this.reset(fresh)
  }

  reset(fresh: boolean) {
    this.x = rand(this.W * 0.05, this.W * 0.95)
    this.y = fresh ? rand(this.H * 0.6, this.H) : this.H + rand(0, 20)
    this.r = rand(14, 36)
    this.maxR = this.r * rand(2.5, 4.5)
    this.vy = rand(-0.3, -0.7)
    this.vx = rand(-0.06, 0.06)
    this.ph = rand(0, Math.PI * 2)
    this.fq = rand(0.005, 0.014)
    this.life = 0
    this.maxL = rand(300, 600)
    this.alpha = 0
    this.peak = rand(0.03, 0.07)
  }

  update() {
    this.life++
    const p = this.life / this.maxL
    const fadeIn = Math.min(1, p / 0.12)
    const midFade = Math.max(0, Math.min(1, (this.y - this.H * 0.52) / (this.H * 0.1)))
    this.alpha = this.peak * fadeIn * midFade
    this.r += (this.maxR - this.r) * 0.003
    this.y += this.vy
    this.x += this.vx + Math.sin((this.ph += this.fq)) * 0.15
    if (this.life >= this.maxL || this.y < this.H * 0.48) this.reset(false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha < 0.004) return
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r)
    g.addColorStop(0, `rgba(50,140,8,${this.alpha})`)
    g.addColorStop(0.5, `rgba(30,90,4,${this.alpha * 0.45})`)
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function runVenomDrip(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const drops = Array.from(
    {
      length: 38,
    },
    () => new Drop(W, H, true),
  )
  const pools = Array.from(
    {
      length: 7,
    },
    () => {
      const p = new Pool(W, H)
      p.life = rand(0, p.maxL * 0.7)
      return p
    },
  )
  const fumes = Array.from(
    {
      length: 16,
    },
    () => new Fume(W, H, true),
  )

  // Clear module-level splashes on init
  splashes.length = 0

  let bgPh = 0
  let raf = 0

  function render() {
    ctx.clearRect(0, 0, W, H)

    // Pulsing ground glow
    bgPh += 0.003
    const pulse = 0.5 + 0.5 * Math.sin(bgPh)
    const gx = W * (0.25 + 0.5 * Math.sin(bgPh * 0.28))
    const g = ctx.createRadialGradient(gx, H, 0, gx, H, W * 0.48)
    g.addColorStop(0, `rgba(30,100,5,${0.02 + pulse * 0.02})`)
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    for (const p of pools) {
      p.update()
      p.draw(ctx)
    }
    for (const f of fumes) {
      f.update()
      f.draw(ctx)
    }
    updateSplashes(ctx, H)
    for (const d of drops) {
      d.update()
      d.draw(ctx)
    }

    raf = requestAnimationFrame(render)
  }
  render()

  return () => {
    cancelAnimationFrame(raf)
    splashes.length = 0
  }
}
