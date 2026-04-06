function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

const SMOKE_COLORS: [
  number,
  number,
  number,
][] = [
  [
    48,
    10,
    80,
  ],
  [
    65,
    20,
    100,
  ],
  [
    30,
    5,
    55,
  ],
  [
    80,
    25,
    120,
  ],
  [
    20,
    8,
    45,
  ],
]

class Smoke {
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
  peakA = 0
  col: [
    number,
    number,
    number,
  ] = [
    0,
    0,
    0,
  ]
  W: number
  H: number

  constructor(W: number, H: number, fresh: boolean) {
    this.W = W
    this.H = H
    this.reset(fresh)
  }

  reset(fresh: boolean) {
    this.x = rand(this.W * 0.05, this.W * 0.95)
    this.y = fresh ? rand(this.H * 0.55, this.H + 40) : this.H + rand(10, 60)
    this.r = rand(28, 70)
    this.maxR = this.r * rand(3.5, 6.5)
    this.vy = rand(-0.7, -1.5)
    this.vx = rand(-0.08, 0.08)
    this.ph = rand(0, Math.PI * 2)
    this.fq = rand(0.004, 0.012)
    this.life = 0
    this.maxL = rand(600, 1000)
    this.alpha = 0
    this.peakA = rand(0.13, 0.26)
    this.col = SMOKE_COLORS[Math.floor(Math.random() * SMOKE_COLORS.length)]
  }

  update() {
    this.life++
    const p = this.life / this.maxL
    const fadeIn = Math.min(1, p / 0.1)
    const midFade = Math.max(0, Math.min(1, (this.y - this.H * 0.44) / (this.H * 0.12)))
    this.alpha = this.peakA * fadeIn * midFade
    this.r = this.r + (this.maxR - this.r) * 0.003
    this.y += this.vy
    this.x += this.vx + Math.sin((this.ph += this.fq)) * 0.2
    if (this.life >= this.maxL || this.y < this.H * 0.4) this.reset(false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha < 0.003) return
    const [r, g, b] = this.col
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r)
    grad.addColorStop(0, `rgba(${r},${g},${b},${this.alpha})`)
    grad.addColorStop(0.45, `rgba(${r},${g},${b},${this.alpha * 0.5})`)
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

class Tendril {
  x = 0
  y = 0
  len = 0
  vy = 0
  vx = 0
  life = 0
  maxL = 0
  alpha = 0
  peakA = 0
  angle = 0
  width = 0
  W: number
  H: number

  constructor(W: number, H: number, fresh: boolean) {
    this.W = W
    this.H = H
    this.reset(fresh)
  }

  reset(fresh: boolean) {
    this.x = rand(this.W * 0.1, this.W * 0.9)
    this.y = fresh ? rand(this.H * 0.4, this.H) : this.H + rand(0, 30)
    this.len = rand(30, 80)
    this.vy = rand(-0.8, -1.6)
    this.vx = rand(-0.06, 0.06)
    this.life = 0
    this.maxL = rand(400, 700)
    this.alpha = 0
    this.peakA = rand(0.09, 0.18)
    this.angle = rand(-0.18, 0.18)
    this.width = rand(0.6, 1.4)
  }

  update() {
    this.life++
    const p = this.life / this.maxL
    const fadeIn = Math.min(1, p / 0.1)
    const midFade = Math.max(0, Math.min(1, (this.y - this.H * 0.46) / (this.H * 0.1)))
    this.alpha = this.peakA * fadeIn * midFade
    this.y += this.vy
    this.x += this.vx
    if (this.life >= this.maxL || this.y < this.H * 0.42) this.reset(false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha < 0.003) return
    const dx = Math.sin(this.angle) * this.len
    const dy = -this.len
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.lineWidth = this.width
    ctx.lineCap = "round"
    const lg = ctx.createLinearGradient(this.x, this.y, this.x + dx, this.y + dy)
    lg.addColorStop(0, "rgba(100,30,160,0.9)")
    lg.addColorStop(0.6, "rgba(120,50,180,0.4)")
    lg.addColorStop(1, "rgba(100,30,160,0)")
    ctx.strokeStyle = lg
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.x + dx, this.y + dy)
    ctx.stroke()
    ctx.restore()
  }
}

class Mote {
  x = 0
  y = 0
  r = 0
  vy = 0
  vx = 0
  alpha = 0
  aD = 0
  ph = 0
  fq = 0
  W: number
  H: number

  constructor(W: number, H: number, fresh: boolean) {
    this.W = W
    this.H = H
    this.reset(fresh)
  }

  reset(fresh: boolean) {
    this.x = rand(0, this.W)
    this.y = fresh ? rand(0, this.H) : this.H + 5
    this.r = rand(0.5, 1.5)
    this.vy = rand(-0.08, -0.22)
    this.vx = rand(-0.05, 0.05)
    this.alpha = rand(0.05, 0.18)
    this.aD = rand(0.001, 0.003) * (Math.random() < 0.5 ? 1 : -1)
    this.ph = rand(0, Math.PI * 2)
    this.fq = rand(0.008, 0.02)
  }

  update() {
    this.y += this.vy
    this.x += this.vx + Math.sin((this.ph += this.fq)) * 0.12
    this.alpha += this.aD
    if (this.alpha > 0.18 || this.alpha < 0.03) this.aD *= -1
    if (this.y < -5) this.reset(false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 2.5)
    g.addColorStop(0, "rgba(150,60,220,0.8)")
    g.addColorStop(1, "rgba(80,20,130,0)")
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r * 2.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

export function runShadowSmoke(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const smokes = Array.from(
    {
      length: 30,
    },
    () => new Smoke(W, H, true),
  )
  const tendrils = Array.from(
    {
      length: 14,
    },
    () => new Tendril(W, H, true),
  )
  const motes = Array.from(
    {
      length: 22,
    },
    () => new Mote(W, H, true),
  )

  let bgPh = 0
  let raf = 0

  function render() {
    ctx.clearRect(0, 0, W, H)

    // Pulsing ground shadow
    bgPh += 0.003
    const pulse = 0.5 + 0.5 * Math.sin(bgPh)
    const gx = W * (0.3 + 0.4 * Math.sin(bgPh * 0.3))
    const g = ctx.createRadialGradient(gx, H, 0, gx, H, W * 0.45)
    g.addColorStop(0, `rgba(55,12,85,${0.06 + pulse * 0.04})`)
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    for (const m of motes) {
      m.update()
      m.draw(ctx)
    }
    for (const t of tendrils) {
      t.update()
      t.draw(ctx)
    }
    for (const s of smokes) {
      s.update()
      s.draw(ctx)
    }

    raf = requestAnimationFrame(render)
  }
  render()

  return () => cancelAnimationFrame(raf)
}
