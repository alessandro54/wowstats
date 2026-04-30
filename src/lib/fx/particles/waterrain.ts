function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

const ANGLE_DEG = -12
const RAD = (ANGLE_DEG * Math.PI) / 180
const DIR_X = Math.sin(RAD)
const DIR_Y = Math.cos(RAD)

class Drop {
  x = 0
  y = 0
  len = 0
  spd = 0
  alpha = 0
  W: number
  H: number

  constructor(W: number, H: number, fresh: boolean) {
    this.W = W
    this.H = H
    this.reset(fresh)
  }

  reset(fresh: boolean) {
    this.spd = rand(8, 18)
    this.len = rand(8, 22)
    this.alpha = rand(0.12, 0.35)
    if (fresh) {
      this.x = rand(-this.W * 0.1, this.W * 1.1)
      this.y = rand(-this.H * 0.1, this.H * 1.05)
    } else {
      // Spawn at top or left edge
      if (Math.random() < 0.7) {
        this.x = rand(-this.W * 0.1, this.W * 1.1)
        this.y = rand(-60, -8)
      } else {
        this.x = rand(-60, -8)
        this.y = rand(-30, this.H * 0.3)
      }
    }
  }

  update() {
    this.x += DIR_X * this.spd
    this.y += DIR_Y * this.spd
    if (this.y > this.H + 20 || this.x > this.W + 20) this.reset(false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.alpha
    ctx.strokeStyle = "rgba(120,200,240,1)"
    ctx.lineWidth = 0.7
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.x - DIR_X * this.len, this.y - DIR_Y * this.len)
    ctx.stroke()
    ctx.globalAlpha = 1
  }
}

class Ripple {
  x = 0
  y = 0
  rx = 0
  ry = 0
  alpha = 0
  life = 0
  maxLife = 0
  W: number
  H: number

  constructor(W: number, H: number) {
    this.W = W
    this.H = H
    this.reset()
  }

  reset() {
    this.x = rand(0, this.W)
    this.y = this.H - rand(0, 4)
    this.rx = 0
    this.ry = 0
    this.alpha = rand(0.15, 0.35)
    this.maxLife = rand(20, 45)
    this.life = rand(0, this.maxLife)
  }

  update() {
    this.life++
    const p = this.life / this.maxLife
    this.rx = p * rand(12, 22)
    this.ry = this.rx * 0.18
    this.alpha = 0.3 * (1 - p)
    if (this.life >= this.maxLife) this.reset()
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha < 0.005) return
    ctx.globalAlpha = this.alpha
    ctx.strokeStyle = "rgba(140,210,245,1)"
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.ellipse(this.x, this.y, this.rx, this.ry, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1
  }
}

export function runWaterRain(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const drops = Array.from(
    {
      length: 120,
    },
    () => new Drop(W, H, true),
  )
  const ripples = Array.from(
    {
      length: 18,
    },
    () => new Ripple(W, H),
  )

  let raf = 0

  function drawMist() {
    const g = ctx.createLinearGradient(0, 0, 0, H * 0.4)
    g.addColorStop(0, "rgba(80,160,200,0.04)")
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }

  function render() {
    ctx.clearRect(0, 0, W, H)
    drawMist()
    for (const d of drops) {
      d.update()
      d.draw(ctx)
    }
    for (const r of ripples) {
      r.update()
      r.draw(ctx)
    }
    raf = requestAnimationFrame(render)
  }
  render()

  return () => cancelAnimationFrame(raf)
}
