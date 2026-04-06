// --- Shaders ---

export const BG_VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const BG_FRAGMENT_SHADER = `
precision mediump float;
uniform float uT;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uDark;
varying vec2 vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  vec2 a = hash2(i), b = hash2(i + vec2(1, 0)), c = hash2(i + vec2(0, 1)), d = hash2(i + vec2(1, 1));
  return mix(
    mix(dot(a * 2.0 - 1.0, f), dot(b * 2.0 - 1.0, f - vec2(1, 0)), u.x),
    mix(dot(c * 2.0 - 1.0, f - vec2(0, 1)), dot(d * 2.0 - 1.0, f - vec2(1, 1)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  v += a * noise(p); p = p * 2.02 + vec2(1.7, 9.2); a *= 0.5;
  v += a * noise(p); p = p * 2.03 + vec2(5.2, 1.3); a *= 0.5;
  v += a * noise(p);
  return v / 0.875;
}

void main() {
  vec2 uv = vUv;
  uv.x *= uRes.x / uRes.y;
  uv += uMouse * 0.02;

  float t = uT * 0.07;
  vec2 q = vec2(fbm(uv + t), fbm(uv + vec2(5.2, 1.3)));
  vec2 r = vec2(
    fbm(uv + 3.0 * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(uv + 3.0 * q + vec2(8.3, 2.8) + 0.126 * t)
  );
  float f = fbm(uv + 3.0 * r);
  f = f * 0.5 + 0.5;

  vec3 dCol = mix(vec3(0.02, 0.005, 0.005), vec3(0.45, 0.07, 0.01), clamp(f * 2.0, 0.0, 1.0));
  dCol = mix(dCol, vec3(0.75, 0.22, 0.03), clamp(f * f * 3.5, 0.0, 1.0));
  dCol *= 0.35;

  vec3 lCol = mix(vec3(0.98, 0.975, 0.97), vec3(0.96, 0.95, 0.93), clamp(f * 2.0, 0.0, 1.0));
  lCol = mix(lCol, vec3(0.94, 0.92, 0.89), clamp(f * f * 1.5, 0.0, 1.0));

  vec3 col = mix(lCol, dCol, uDark);

  vec2 vPos = vUv * 2.0 - 1.0;
  float vig = mix(0.25, 0.55, uDark);
  col *= 1.0 - vig * dot(vPos, vPos);

  gl_FragColor = vec4(col, 1.0);
}
`

// --- Constants ---

export const PARTICLE_COUNT = 80
export const SPREAD_X = 160
export const SPREAD_Y = 120
export const FRAME_INTERVAL = 1000 / 30

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
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60
    px0[i] = positions[i * 3]
    vy[i] = 0.018 + Math.random() * 0.055
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
    px0[i] + vx[i] * frame + Math.sin(frame * swayFrequency[i] + swayPhase[i]) * swayAmplitude[i]

  if (positions[i * 3 + 1] > HALF_Y + 8) {
    positions[i * 3 + 1] = -HALF_Y - 8
    px0[i] = (Math.random() - 0.5) * SPREAD_X
    positions[i * 3] = px0[i]
  }

  const breathe = 0.75 + 0.25 * Math.sin(frame * 0.04 + swayPhase[i])
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
