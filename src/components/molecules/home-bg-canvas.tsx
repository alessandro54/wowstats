"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

const VS = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const FS = `
precision mediump float;
uniform float uT;
uniform vec2 uRes;
uniform vec2 uMouse;
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
  v += a * noise(p); p = p * 2.01 + vec2(3.1, 7.4); a *= 0.5;
  v += a * noise(p);
  return v / 0.9375;
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

  vec3 col = mix(vec3(0.02, 0.005, 0.005), vec3(0.45, 0.07, 0.01), clamp(f * 2.0, 0.0, 1.0));
  col = mix(col, vec3(0.75, 0.22, 0.03), clamp(f * f * 3.5, 0.0, 1.0));
  col *= 0.35;

  vec2 vPos = vUv * 2.0 - 1.0;
  col *= 1.0 - 0.55 * dot(vPos, vPos);

  gl_FragColor = vec4(col, 1.0);
}
`

function CssFallback() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: -1,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(45,12,0,0.7) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 20% 60%, rgba(80,20,0,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 30%, rgba(60,15,0,0.12) 0%, transparent 60%),
            linear-gradient(180deg, #050403 0%, #0a0604 50%, #050403 100%)
          `,
        }}
      />
    </div>
  )
}

function BgCanvasInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isMobile = window.innerWidth < 900
    const isLowEnd = navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 4
    if (isMobile || isLowEnd) {
      setUseFallback(true)
      return
    }

    // Check WebGL support on a throwaway canvas
    const testCanvas = document.createElement("canvas")
    const testCtx = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")
    if (!testCtx) {
      setUseFallback(true)
      return
    }

    let THREE: typeof import("three")
    let renderer: any
    let bgScene: any
    let bgCamera: any
    let material: any
    let particleScene: any
    let particleCamera: any
    let points: any
    let pPos: Float32Array
    let pAttr: any
    let raf = 0
    let frame = 0
    let mx = 0
    let my = 0

    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = -(e.clientY / window.innerHeight - 0.5) * 2
    }

    // Particle motion arrays
    const N = 120
    const SPREAD_X = 160
    const SPREAD_Y = 120
    const HALF_Y = SPREAD_Y / 2
    let px0: Float32Array
    let vy: Float32Array
    let vx: Float32Array
    let swAmp: Float32Array
    let swFq: Float32Array
    let swPh: Float32Array
    let baseA: Float32Array

    async function init() {
      THREE = await import("three")
      const w = window.innerWidth
      const h = window.innerHeight

      renderer = new THREE.WebGLRenderer({
        canvas: canvas!,
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      })
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.autoClear = false

      // ── BG Scene (fullscreen FBM shader) ──
      bgScene = new THREE.Scene()
      bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

      material = new THREE.ShaderMaterial({
        vertexShader: VS,
        fragmentShader: FS,
        uniforms: {
          uT: {
            value: 0,
          },
          uRes: {
            value: new THREE.Vector2(w, h),
          },
          uMouse: {
            value: new THREE.Vector2(0, 0),
          },
        },
        depthTest: false,
        depthWrite: false,
      })
      bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

      // ── Particle Scene (rising orange dots) ──
      particleScene = new THREE.Scene()
      particleCamera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000)
      particleCamera.position.set(0, 0, 100)

      // Sprite texture
      const spriteCanvas = document.createElement("canvas")
      spriteCanvas.width = spriteCanvas.height = 64
      const sc = spriteCanvas.getContext("2d")!
      const sg = sc.createRadialGradient(32, 32, 0, 32, 32, 32)
      sg.addColorStop(0, "rgba(255,255,255,1)")
      sg.addColorStop(0.25, "rgba(255,255,255,0.8)")
      sg.addColorStop(0.6, "rgba(255,255,255,0.2)")
      sg.addColorStop(1, "rgba(255,255,255,0)")
      sc.fillStyle = sg
      sc.fillRect(0, 0, 64, 64)
      const sprite = new THREE.CanvasTexture(spriteCanvas)

      // Palette — warm orange family
      const PAL = [
        [
          1.0,
          0.487,
          0.039,
        ],
        [
          0.94,
          0.376,
          0.0,
        ],
        [
          1.0,
          0.667,
          0.251,
        ],
        [
          1.0,
          0.333,
          0.0,
        ],
        [
          0.56,
          0.224,
          0.0,
        ],
        [
          1.0,
          0.867,
          0.733,
        ],
      ]
      function pickColor() {
        const r = Math.random()
        if (r < 0.35) return PAL[0]
        if (r < 0.58) return PAL[1]
        if (r < 0.72) return PAL[2]
        if (r < 0.84) return PAL[3]
        if (r < 0.95) return PAL[4]
        return PAL[5]
      }

      pPos = new Float32Array(N * 3)
      const col = new Float32Array(N * 3)
      const sz = new Float32Array(N)
      px0 = new Float32Array(N)
      vy = new Float32Array(N)
      vx = new Float32Array(N)
      swAmp = new Float32Array(N)
      swFq = new Float32Array(N)
      swPh = new Float32Array(N)
      baseA = new Float32Array(N)

      for (let i = 0; i < N; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * SPREAD_X
        pPos[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_Y
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 60
        px0[i] = pPos[i * 3]
        vy[i] = 0.018 + Math.random() * 0.055
        vx[i] = (Math.random() - 0.5) * 0.012
        swAmp[i] = 0.15 + Math.random() * 0.6
        swFq[i] = 0.008 + Math.random() * 0.018
        swPh[i] = Math.random() * Math.PI * 2
        const c = pickColor()
        col[i * 3] = c[0]
        col[i * 3 + 1] = c[1]
        col[i * 3 + 2] = c[2]
        const isBig = Math.random() < 0.04
        sz[i] = isBig ? 3.5 + Math.random() * 3 : 0.8 + Math.random() * 2.2
        baseA[i] = 0.3 + Math.random() * 0.7
      }

      const geo = new THREE.BufferGeometry()
      pAttr = new THREE.BufferAttribute(pPos, 3)
      geo.setAttribute("position", pAttr)
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3))
      geo.setAttribute("size", new THREE.BufferAttribute(sz, 1))

      const pMat = new THREE.PointsMaterial({
        map: sprite,
        vertexColors: true,
        size: 3,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        alphaTest: 0.01,
      })

      points = new THREE.Points(geo, pMat)
      particleScene.add(points)

      document.addEventListener("mousemove", onMouseMove)

      function animate() {
        frame++

        // Update FBM shader
        material.uniforms.uT.value = frame * 0.016
        material.uniforms.uMouse.value.x += (mx - material.uniforms.uMouse.value.x) * 0.05
        material.uniforms.uMouse.value.y += (my - material.uniforms.uMouse.value.y) * 0.05

        // Update particles
        for (let i = 0; i < N; i++) {
          pPos[i * 3 + 1] += vy[i]
          pPos[i * 3] = px0[i] + vx[i] * frame + Math.sin(frame * swFq[i] + swPh[i]) * swAmp[i]
          if (pPos[i * 3 + 1] > HALF_Y + 8) {
            pPos[i * 3 + 1] = -HALF_Y - 8
            px0[i] = (Math.random() - 0.5) * SPREAD_X
            pPos[i * 3] = px0[i]
          }
          const breathe = 0.75 + 0.25 * Math.sin(frame * 0.04 + swPh[i])
          const topFade = 1 - Math.max(0, (pPos[i * 3 + 1] - (HALF_Y - 16)) / 16)
          const botFade = 1 - Math.max(0, (-HALF_Y + 14 - pPos[i * 3 + 1]) / 14)
          const szArr = geo.attributes.size.array as Float32Array
          szArr[i] = (0.8 + Math.random() * 2.2) * baseA[i] * breathe * Math.min(topFade, botFade)
        }
        pAttr.needsUpdate = true
        geo.attributes.size.needsUpdate = true

        // Mouse parallax on particles
        points.rotation.y += (mx * 0.06 - points.rotation.y) * 0.03
        points.rotation.x += (-my * 0.04 - points.rotation.x) * 0.03
        particleCamera.position.x += (mx * 5 - particleCamera.position.x) * 0.02
        particleCamera.position.y += (-my * 3 - particleCamera.position.y) * 0.02
        particleCamera.lookAt(0, 0, 0)

        // Render both scenes
        renderer.clear()
        renderer.render(bgScene, bgCamera)
        renderer.render(particleScene, particleCamera)

        raf = requestAnimationFrame(animate)
      }
      animate()
    }

    init().catch(() => setUseFallback(true))

    const onResize = () => {
      if (!renderer) return
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h)
      if (material) material.uniforms.uRes.value.set(w, h)
      if (particleCamera) {
        particleCamera.aspect = w / h
        particleCamera.updateProjectionMatrix()
      }
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("mousemove", onMouseMove)
      renderer?.dispose()
    }
  }, [])

  if (useFallback) return <CssFallback />

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: -1,
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}

/**
 * Portals the canvas outside SidebarInset so `position: fixed` actually
 * works relative to the viewport, not the scroll container.
 */
export function HomeBgCanvas() {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Mount outside the SidebarInset scroll container
    const inset = document.querySelector("[data-slot='sidebar-inset']")
    const target = inset?.parentElement ?? document.body
    setPortalTarget(target)
  }, [])

  if (!portalTarget) return null

  return createPortal(<BgCanvasInner />, portalTarget)
}
