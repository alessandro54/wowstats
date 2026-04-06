import { describe, expect, it, vi } from "vitest"
import {
  BG_VERTEX_SHADER,
  BG_FRAGMENT_SHADER,
  PARTICLE_COUNT,
  SPREAD_X,
  SPREAD_Y,
  FRAME_INTERVAL,
  EMBER_PALETTE,
  pickEmberColor,
  initParticles,
  updateParticle,
  isLowEndDevice,
} from "../home-bg"

describe("home-bg constants", () => {
  it("exports vertex shader as non-empty string", () => {
    expect(typeof BG_VERTEX_SHADER).toBe("string")
    expect(BG_VERTEX_SHADER).toContain("gl_Position")
  })

  it("exports fragment shader as non-empty string", () => {
    expect(typeof BG_FRAGMENT_SHADER).toBe("string")
    expect(BG_FRAGMENT_SHADER).toContain("gl_FragColor")
  })

  it("exports numeric constants", () => {
    expect(PARTICLE_COUNT).toBe(80)
    expect(SPREAD_X).toBe(160)
    expect(SPREAD_Y).toBe(120)
    expect(FRAME_INTERVAL).toBeCloseTo(1000 / 30)
  })

  it("exports ember palette with 6 RGB triplets", () => {
    expect(EMBER_PALETTE).toHaveLength(6)
    for (const color of EMBER_PALETTE) {
      expect(color).toHaveLength(3)
      for (const c of color) {
        expect(c).toBeGreaterThanOrEqual(0)
        expect(c).toBeLessThanOrEqual(1)
      }
    }
  })
})

describe("pickEmberColor", () => {
  it("returns a 3-element RGB tuple from the palette", () => {
    const color = pickEmberColor()
    expect(color).toHaveLength(3)
    expect(EMBER_PALETTE).toContainEqual(color)
  })
})

describe("initParticles", () => {
  it("returns typed arrays with correct lengths for given count", () => {
    const data = initParticles(10)
    expect(data.positions).toBeInstanceOf(Float32Array)
    expect(data.positions.length).toBe(30) // 10 * 3
    expect(data.colors).toBeInstanceOf(Float32Array)
    expect(data.colors.length).toBe(30)
    expect(data.sizes).toBeInstanceOf(Float32Array)
    expect(data.sizes.length).toBe(10)
    expect(data.baseSizes).toBeInstanceOf(Float32Array)
    expect(data.baseSizes.length).toBe(10)
    expect(data.baseAlpha).toBeInstanceOf(Float32Array)
    expect(data.baseAlpha.length).toBe(10)
    expect(data.px0).toBeInstanceOf(Float32Array)
    expect(data.px0.length).toBe(10)
    expect(data.vy).toBeInstanceOf(Float32Array)
    expect(data.vy.length).toBe(10)
    expect(data.vx).toBeInstanceOf(Float32Array)
    expect(data.vx.length).toBe(10)
    expect(data.swayAmplitude).toBeInstanceOf(Float32Array)
    expect(data.swayAmplitude.length).toBe(10)
    expect(data.swayFrequency).toBeInstanceOf(Float32Array)
    expect(data.swayFrequency.length).toBe(10)
    expect(data.swayPhase).toBeInstanceOf(Float32Array)
    expect(data.swayPhase.length).toBe(10)
  })

  it("positions particles within spread bounds", () => {
    const data = initParticles(50)
    for (let i = 0; i < 50; i++) {
      expect(Math.abs(data.positions[i * 3])).toBeLessThanOrEqual(SPREAD_X / 2)
      expect(Math.abs(data.positions[i * 3 + 1])).toBeLessThanOrEqual(SPREAD_Y / 2)
    }
  })

  it("sets positive upward velocities", () => {
    const data = initParticles(50)
    for (let i = 0; i < 50; i++) {
      expect(data.vy[i]).toBeGreaterThan(0)
    }
  })
})

describe("updateParticle", () => {
  it("moves particle upward by its velocity", () => {
    const data = initParticles(1)
    const yBefore = data.positions[1]
    const vy = data.vy[0]
    updateParticle(0, data, 1)
    expect(data.positions[1]).toBeCloseTo(yBefore + vy)
  })

  it("wraps particle to bottom when exceeding top boundary", () => {
    const data = initParticles(1)
    const HALF_Y = SPREAD_Y / 2
    data.positions[1] = HALF_Y + 9 // above wrap threshold
    updateParticle(0, data, 1)
    expect(data.positions[1]).toBe(-HALF_Y - 8)
  })
})

describe("isLowEndDevice", () => {
  it("returns true when hardwareConcurrency <= 4", () => {
    vi.stubGlobal("navigator", {
      hardwareConcurrency: 2,
    })
    expect(isLowEndDevice()).toBe(true)
    vi.unstubAllGlobals()
  })

  it("returns false when hardwareConcurrency > 4", () => {
    vi.stubGlobal("navigator", {
      hardwareConcurrency: 8,
    })
    expect(isLowEndDevice()).toBe(false)
    vi.unstubAllGlobals()
  })

  it("returns false when hardwareConcurrency is undefined", () => {
    vi.stubGlobal("navigator", {})
    expect(isLowEndDevice()).toBe(false)
    vi.unstubAllGlobals()
  })
})
