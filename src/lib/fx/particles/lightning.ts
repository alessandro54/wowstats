function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

function randInt(a: number, b: number) {
  return Math.floor(rand(a, b + 1))
}

interface Seg {
  x1: number
  y1: number
  x2: number
  y2: number
}

class Bolt {
  segs: Seg[] = []
  alpha = 0
  life = 0
  maxLife = 0
  W: number
  H: number
  color: string

  constructor(W: number, H: number) {
    this.W = W
    this.H = H
    this.color = Math.random() < 0.6 ? "160,200,255" : "220,240,255"
    this.spawn()
  }

  spawn() {
    this.segs = []
    const startX = rand(this.W * 0.1, this.W * 0.9)
    this.buildBranch(startX, 0, startX + rand(-60, 60), this.H * rand(0.5, 0.85), 0)
    this.alpha = rand(0.55, 0.9)
    this.life = 0
    this.maxLife = randInt(8, 18)
  }

  buildBranch(x1: number, y1: number, x2: number, y2: number, depth: number) {
    if (depth > 6) return
    const dy = y2 - y1
    const dx = x2 - x1
    const len = Math.sqrt(dx * dx + dy * dy)
    if (len < 8) {
      this.segs.push({
        x1,
        y1,
        x2,
        y2,
      })
      return
    }
    // Midpoint displacement
    const mx = (x1 + x2) / 2 + rand(-len * 0.35, len * 0.35)
    const my = (y1 + y2) / 2 + rand(-len * 0.1, len * 0.1)
    this.buildBranch(x1, y1, mx, my, depth + 1)
    this.buildBranch(mx, my, x2, y2, depth + 1)
    // Occasional branch
    if (depth < 3 && Math.random() < 0.4) {
      const bx = mx + rand(-80, 80)
      const by = my + rand(30, len * 0.5)
      this.buildBranch(mx, my, bx, by, depth + 2)
    }
  }

  update() {
    this.life++
    // Fast flash in, slow fade out
    const p = this.life / this.maxLife
    if (p < 0.2) this.alpha = 0.9 * (p / 0.2)
    else this.alpha = 0.9 * (1 - (p - 0.2) / 0.8)
    if (this.life >= this.maxLife) {
      // Dead — wait for parent to respawn
    }
  }

  get isDead() {
    return this.life >= this.maxLife
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha < 0.01) return
    // Outer glow
    ctx.globalAlpha = this.alpha * 0.25
    ctx.strokeStyle = `rgba(${this.color},1)`
    ctx.lineWidth = 6
    ctx.lineCap = "round"
    for (const s of this.segs) {
      ctx.beginPath()
      ctx.moveTo(s.x1, s.y1)
      ctx.lineTo(s.x2, s.y2)
      ctx.stroke()
    }
    // Mid glow
    ctx.globalAlpha = this.alpha * 0.55
    ctx.lineWidth = 2.5
    for (const s of this.segs) {
      ctx.beginPath()
      ctx.moveTo(s.x1, s.y1)
      ctx.lineTo(s.x2, s.y2)
      ctx.stroke()
    }
    // Core
    ctx.globalAlpha = this.alpha
    ctx.strokeStyle = "rgba(230,245,255,1)"
    ctx.lineWidth = 0.8
    for (const s of this.segs) {
      ctx.beginPath()
      ctx.moveTo(s.x1, s.y1)
      ctx.lineTo(s.x2, s.y2)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }
}

class StaticSpark {
  x = 0
  y = 0
  alpha = 0
  r = 0
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
    this.y = rand(0, this.H * 0.8)
    this.r = rand(0.5, 1.5)
    this.alpha = rand(0.1, 0.5)
    this.maxLife = randInt(15, 60)
    this.life = rand(0, this.maxLife)
  }

  update() {
    this.life++
    if (this.life >= this.maxLife) this.reset()
  }

  draw(ctx: CanvasRenderingContext2D) {
    const p = this.life / this.maxLife
    const a = this.alpha * Math.sin(p * Math.PI)
    if (a < 0.01) return
    ctx.globalAlpha = a
    ctx.fillStyle = "rgba(180,220,255,1)"
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

export function runLightning(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const bolts: (Bolt | null)[] = [
    null,
    null,
  ]
  const sparks = Array.from(
    {
      length: 40,
    },
    () => new StaticSpark(W, H),
  )

  let frameCount = 0
  const BOLT_MIN = 80
  const BOLT_MAX = 140
  let nextStrike = [
    randInt(BOLT_MIN, BOLT_MAX),
    randInt(BOLT_MIN, BOLT_MAX),
  ]
  let timers = [
    randInt(0, nextStrike[0]),
    randInt(0, nextStrike[1]),
  ]
  let raf = 0

  function render() {
    ctx.clearRect(0, 0, W, H)
    frameCount++

    // Background flash when bolt is active
    const anyBolt = bolts.some((b) => b && !b.isDead)
    if (anyBolt) {
      const maxA = Math.max(...bolts.map((b) => (b && !b.isDead ? b.alpha : 0)))
      const g = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, W * 0.7)
      g.addColorStop(0, `rgba(100,160,255,${maxA * 0.08})`)
      g.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
    }

    // Sparks
    for (const s of sparks) {
      s.update()
      s.draw(ctx)
    }

    // Bolts
    for (let i = 0; i < 2; i++) {
      timers[i]++
      if (timers[i] >= nextStrike[i]) {
        bolts[i] = new Bolt(W, H)
        timers[i] = 0
        nextStrike[i] = randInt(BOLT_MIN, BOLT_MAX)
      }
      const b = bolts[i]
      if (b && !b.isDead) {
        b.update()
        b.draw(ctx)
      }
    }

    raf = requestAnimationFrame(render)
  }
  render()

  return () => cancelAnimationFrame(raf)
}
