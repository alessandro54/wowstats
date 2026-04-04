const CRIMSON = "rgba(210,10,35,"
const BLOOD = "rgba(170,0,25,"
const ARTERIAL = "rgba(240,30,55,"
const DARK_RED = "rgba(100,0,15,"
const MAROON = "rgba(130,10,30,"
const ROSE = "rgba(220,100,120,"

const COUNT = 115

function rand(a: number, b: number) {
  return Math.random() * (b - a) + a
}

class Ripple {
  x: number
  y: number
  r: number
  maxR: number
  alpha: number
  alive = true
  constructor(x: number, H: number) {
    this.x = x
    this.y = H - rand(4, 12)
    this.r = rand(2, 8)
    this.maxR = rand(18, 45)
    this.alpha = rand(0.2, 0.4)
  }
  update() {
    this.r += 0.5
    this.alpha *= 0.94
    if (this.alpha < 0.01 || this.r > this.maxR) this.alive = false
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.strokeStyle = CRIMSON + "1)"
    ctx.lineWidth = 0.6
    ctx.beginPath()
    ctx.ellipse(this.x, this.y, this.r, this.r * 0.22, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
}

class BloodParticle {
  type = 0
  x = 0
  y = 0
  r = 0
  vy = 0
  vx = 0
  stretch = 1
  swayAmp = 0
  swayFq = 0
  phase = 0
  alpha = 0
  alphaDelta = 0
  flicker = false
  flickerPh = 0
  flickerFreq = 0
  landed = false
  orbitR = 0
  orbitAng = 0
  orbitSpd = 0
  orbitEcc = 0
  W: number
  H: number
  CX: number
  CY: number
  // Cached gradients
  glowGrad: CanvasGradient | null = null
  bodyGrad: CanvasGradient | null = null
  mistGrad: CanvasGradient | null = null
  emberGrad: CanvasGradient | null = null

  constructor(ctx: CanvasRenderingContext2D, W: number, H: number, fresh: boolean) {
    this.W = W
    this.H = H
    this.CX = W / 2
    this.CY = H / 2
    this.reset(ctx, fresh)
  }

  reset(ctx: CanvasRenderingContext2D, fresh: boolean) {
    const r = Math.random()
    this.type = r < 0.38 ? 0 : r < 0.62 ? 1 : r < 0.76 ? 2 : r < 0.9 ? 3 : 4
    this.x = rand(0, this.W)
    this.landed = false

    if (this.type === 2) {
      this.orbitR = rand(this.W * 0.12, this.W * 0.32)
      this.orbitAng = rand(0, Math.PI * 2)
      this.orbitSpd = rand(0.0006, 0.0018) * (Math.random() < 0.5 ? 1 : -1)
      this.orbitEcc = rand(0.55, 0.85)
      this.x = this.CX + Math.cos(this.orbitAng) * this.orbitR
      this.y = this.CY + Math.sin(this.orbitAng) * this.orbitR * this.orbitEcc
      this.r = rand(2.5, 5.5)
    } else {
      this.y = fresh ? rand(-this.H * 0.05, this.H * 1.1) : rand(-60, -5)
    }

    if (this.type === 0) {
      this.r = rand(1.8, 4.2)
      this.vy = rand(0.8, 2.2)
      this.vx = rand(-0.15, 0.15)
      this.stretch = rand(1.4, 2.8)
    } else if (this.type === 1) {
      this.r = rand(0.5, 1.4)
      this.vy = rand(0.2, 0.6)
      this.vx = rand(-0.1, 0.1)
    } else if (this.type === 3) {
      this.r = rand(0.7, 1.8)
      this.vy = rand(-0.08, -0.35)
      this.vx = rand(-0.15, 0.15)
      this.y = fresh ? rand(this.H * 0.4, this.H) : this.H + rand(0, 20)
    } else if (this.type === 4) {
      this.r = rand(0.8, 2.2)
      this.vy = rand(1.2, 3.5)
      this.vx = rand(-0.8, 0.8)
    }

    this.swayAmp = this.type === 0 ? rand(0.05, 0.2) : rand(0.1, 0.4)
    this.swayFq = rand(0.005, 0.015)
    this.phase = rand(0, Math.PI * 2)

    const maxA = this.type === 2 ? 0.55 : this.type === 1 ? 0.3 : this.type === 3 ? 0.6 : 0.52
    this.alpha = rand(0.06, maxA)
    this.alphaDelta = (Math.random() < 0.5 ? 1 : -1) * rand(0.001, 0.004)

    this.flicker = this.type === 3
    this.flickerPh = rand(0, Math.PI * 2)
    this.flickerFreq = rand(0.06, 0.14)

    // Cache gradients
    if (this.type === 0) {
      const g = ctx.createRadialGradient(0, 0, 0, 0, this.r * 0.4, this.r * 2.5)
      g.addColorStop(0, CRIMSON + "0.25)")
      g.addColorStop(1, CRIMSON + "0)")
      this.glowGrad = g
      const b = ctx.createLinearGradient(-this.r, -this.r, this.r, this.r * this.stretch)
      b.addColorStop(0, ARTERIAL + "0.95)")
      b.addColorStop(0.4, CRIMSON + "0.9)")
      b.addColorStop(1, BLOOD + "0.8)")
      this.bodyGrad = b
    } else if (this.type === 1) {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 2.8)
      g.addColorStop(0, MAROON + "0.8)")
      g.addColorStop(0.5, DARK_RED + "0.3)")
      g.addColorStop(1, DARK_RED + "0)")
      this.mistGrad = g
    } else if (this.type === 3) {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 4)
      g.addColorStop(0, CRIMSON + "0.35)")
      g.addColorStop(1, CRIMSON + "0)")
      this.emberGrad = g
    }
  }

  update(ctx: CanvasRenderingContext2D, t: number, ripples: Ripple[]) {
    if (this.type === 2) {
      this.orbitAng += this.orbitSpd
      this.x = this.CX + Math.cos(this.orbitAng) * this.orbitR
      this.y = this.CY + Math.sin(this.orbitAng) * this.orbitR * this.orbitEcc
      this.alpha += this.alphaDelta
      if (this.alpha > 0.55 || this.alpha < 0.04) this.alphaDelta *= -1
      return
    }

    this.y += this.vy
    this.x += this.vx + Math.sin(t * this.swayFq + this.phase) * this.swayAmp
    this.alpha += this.alphaDelta
    if (this.alpha > 0.5 || this.alpha < 0.03) this.alphaDelta *= -1
    if (this.flicker) this.flickerPh += this.flickerFreq

    if (this.type === 0 && this.y >= this.H - 8 && !this.landed) {
      this.landed = true
      if (ripples.length < 40) ripples.push(new Ripple(this.x, this.H))
    }

    const oob =
      this.type === 3
        ? this.y < -20 || this.x < -40 || this.x > this.W + 40
        : this.y > this.H + 20 || this.x < -40 || this.x > this.W + 40
    if (oob) this.reset(ctx, false)
  }

  draw(ctx: CanvasRenderingContext2D) {
    let a = this.alpha
    if (this.flicker) a *= 0.35 + 0.65 * Math.abs(Math.sin(this.flickerPh))
    const edgeFade = Math.min(1, Math.min(this.x / 60, (this.W - this.x) / 60))
    a *= edgeFade
    if (a < 0.005) return

    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.globalAlpha = a

    switch (this.type) {
      case 0: {
        // Droplet
        const r = this.r,
          s = this.stretch
        ctx.fillStyle = this.glowGrad!
        ctx.beginPath()
        ctx.ellipse(0, r * 0.2, r * 2.5, r * 2.5 * s * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = this.bodyGrad!
        ctx.beginPath()
        ctx.moveTo(0, -r * s)
        ctx.bezierCurveTo(r * 0.7, -r * 0.3, r, r * 0.4, 0, r)
        ctx.bezierCurveTo(-r, r * 0.4, -r * 0.7, -r * 0.3, 0, -r * s)
        ctx.fill()
        ctx.fillStyle = "rgba(255,180,190,0.25)"
        ctx.beginPath()
        ctx.ellipse(-r * 0.18, -r * 0.2, r * 0.22, r * 0.12, -0.6, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 1: // Mist
        ctx.fillStyle = this.mistGrad!
        ctx.beginPath()
        ctx.arc(0, 0, this.r * 2.8, 0, Math.PI * 2)
        ctx.fill()
        break
      case 2: {
        // Life orb — simplified, fewer gradients
        const r = this.r
        const pulse = 0.85 + 0.15 * Math.sin(Date.now() * 0.0025 + this.phase)
        // Single glow circle instead of 2 radial gradients
        ctx.fillStyle = CRIMSON + "0.35)"
        ctx.beginPath()
        ctx.arc(0, 0, r * 2.5 * pulse, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = ARTERIAL + "0.6)"
        ctx.beginPath()
        ctx.arc(0, 0, r * 1.2 * pulse, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = ROSE + "0.95)"
        ctx.beginPath()
        ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 3: // Ember
        ctx.fillStyle = ARTERIAL + "1)"
        ctx.beginPath()
        ctx.arc(0, 0, this.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = this.emberGrad!
        ctx.beginPath()
        ctx.arc(0, 0, this.r * 4, 0, Math.PI * 2)
        ctx.fill()
        break
      case 4: {
        // Splatter — use simple color instead of gradient
        const len = this.r * 3.5,
          ang = Math.atan2(this.vy, this.vx)
        ctx.rotate(ang)
        ctx.fillStyle = CRIMSON + "0.5)"
        ctx.beginPath()
        ctx.ellipse(0, 0, len, this.r * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()
        break
      }
    }
    ctx.restore()
  }
}

export function runBlood(ctx: CanvasRenderingContext2D, W: number, H: number): () => void {
  const particles: BloodParticle[] = []
  let ripples: Ripple[] = []
  for (let i = 0; i < COUNT; i++) particles.push(new BloodParticle(ctx, W, H, true))

  let t = 0
  let raf = 0

  function render() {
    ctx.clearRect(0, 0, W, H)
    t++

    ripples = ripples.filter((r) => r.alive)
    for (const r of ripples) {
      r.update()
      r.draw(ctx)
    }
    for (const p of particles) {
      p.update(ctx, t, ripples)
      p.draw(ctx)
    }

    raf = requestAnimationFrame(render)
  }
  render()

  return () => cancelAnimationFrame(raf)
}
