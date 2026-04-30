// --- Constants ---

export const PARTICLE_COUNT = 130
export const SPREAD_X = 230
export const SPREAD_Y = 130
export const FRAME_INTERVAL = 1000 / 25

// Pre-computed sin lookup table — avoids Math.sin() in hot particle loop
const SIN_TABLE_SIZE = 2048
const SIN_TABLE_MASK = SIN_TABLE_SIZE - 1
const SIN_TABLE = new Float32Array(SIN_TABLE_SIZE)
const TWO_PI = Math.PI * 2
for (let i = 0; i < SIN_TABLE_SIZE; i++) {
  SIN_TABLE[i] = Math.sin((i / SIN_TABLE_SIZE) * TWO_PI)
}
export function fastSin(x: number): number {
  // wrap to [0, TABLE_SIZE)
  const idx = ((x / TWO_PI) * SIN_TABLE_SIZE) & SIN_TABLE_MASK
  return SIN_TABLE[(idx + SIN_TABLE_SIZE) & SIN_TABLE_MASK]
}

// --- Palette ---

export const EMBER_PALETTE: [
  number,
  number,
  number,
][] = [
  [
    1,
    0.487,
    0.039,
  ],
  [
    0.94,
    0.376,
    0,
  ],
  [
    1,
    0.667,
    0.251,
  ],
  [
    1,
    0.333,
    0,
  ],
  [
    0.56,
    0.224,
    0,
  ],
  [
    1,
    0.867,
    0.733,
  ],
]

const PALETTE_THRESHOLDS = [
  0.35,
  0.58,
  0.72,
  0.84,
  0.95,
]

export function pickEmberColor(): [
  number,
  number,
  number,
] {
  const r = Math.random()
  for (let i = 0; i < PALETTE_THRESHOLDS.length; i++) {
    if (r < PALETTE_THRESHOLDS[i]) return EMBER_PALETTE[i]
  }
  return EMBER_PALETTE[5]
}

// --- Particle Data ---

export interface ParticleData {
  positions: Float32Array
  colors: Float32Array
  sizes: Float32Array
  baseSizes: Float32Array
  baseAlpha: Float32Array
  px0: Float32Array
  vy: Float32Array
  vx: Float32Array
  swayAmplitude: Float32Array
  swayFrequency: Float32Array
  swayPhase: Float32Array
}

export function initParticles(count: number): ParticleData {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const baseSizes = new Float32Array(count)
  const baseAlpha = new Float32Array(count)
  const px0 = new Float32Array(count)
  const vy = new Float32Array(count)
  const vx = new Float32Array(count)
  const swayAmplitude = new Float32Array(count)
  const swayFrequency = new Float32Array(count)
  const swayPhase = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * SPREAD_X
    positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_Y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    px0[i] = positions[i * 3]
    vy[i] = 0.12 + Math.random() * 0.22
    vx[i] = (Math.random() - 0.5) * 0.012
    swayAmplitude[i] = 0.15 + Math.random() * 0.6
    swayFrequency[i] = 0.008 + Math.random() * 0.018
    swayPhase[i] = Math.random() * Math.PI * 2
    const c = pickEmberColor()
    colors[i * 3] = c[0]
    colors[i * 3 + 1] = c[1]
    colors[i * 3 + 2] = c[2]
    baseSizes[i] = Math.random() < 0.04 ? 3.5 + Math.random() * 3 : 0.8 + Math.random() * 2.2
    sizes[i] = baseSizes[i]
    baseAlpha[i] = 0.3 + Math.random() * 0.7
  }

  return {
    positions,
    colors,
    sizes,
    baseSizes,
    baseAlpha,
    px0,
    vy,
    vx,
    swayAmplitude,
    swayFrequency,
    swayPhase,
  }
}

// --- Particle Update ---

const HALF_Y = SPREAD_Y / 2

export function updateParticle(i: number, data: ParticleData, frame: number): void {
  const {
    positions,
    px0,
    vy,
    vx,
    swayFrequency,
    swayPhase,
    swayAmplitude,
    baseSizes,
    baseAlpha,
    sizes,
  } = data
  positions[i * 3 + 1] += vy[i]
  positions[i * 3] =
    px0[i] + vx[i] * frame + fastSin(frame * swayFrequency[i] + swayPhase[i]) * swayAmplitude[i]

  if (positions[i * 3 + 1] > HALF_Y + 8) {
    positions[i * 3 + 1] = -HALF_Y - 8
    px0[i] = (Math.random() - 0.5) * SPREAD_X
    positions[i * 3] = px0[i]
  }

  const breathe = 0.75 + 0.25 * fastSin(frame * 0.04 + swayPhase[i])
  const topFade = 1 - Math.max(0, (positions[i * 3 + 1] - (HALF_Y - 16)) / 16)
  const botFade = 1 - Math.max(0, (-HALF_Y + 14 - positions[i * 3 + 1]) / 14)
  sizes[i] = baseSizes[i] * baseAlpha[i] * breathe * Math.min(topFade, botFade)
}

// --- Device Detection ---

export function isLowEndDevice(): boolean {
  if (navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 4) return true
  return false
}

export function hasWebGL(): boolean {
  const c = document.createElement("canvas")
  return !!(c.getContext("webgl") || c.getContext("experimental-webgl"))
}
