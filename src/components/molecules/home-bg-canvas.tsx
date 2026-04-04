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

// Reduced from 4 to 3 FBM octaves, fewer nested FBM calls
const FS = `
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

function CssFallback() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: -1,
      }}
    >
      <div
        className="absolute inset-0 dark:block hidden"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(45,12,0,0.7) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 20% 60%, rgba(80,20,0,0.15) 0%, transparent 60%),
            linear-gradient(180deg, #050403 0%, #0a0604 50%, #050403 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0 dark:hidden block"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(200,140,60,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 20% 60%, rgba(180,100,30,0.03) 0%, transparent 60%),
            linear-gradient(180deg, #fafaf9 0%, #f7f6f4 50%, #fafaf9 100%)
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

    const isLowEnd = navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 4
    if (isLowEnd) {
      setUseFallback(true)
      return
    }

    const testCanvas = document.createElement("canvas")
    if (!testCanvas.getContext("webgl") && !testCanvas.getContext("experimental-webgl")) {
      setUseFallback(true)
      return
    }

    let THREE: typeof import("three")
    let renderer: any, bgScene: any, bgCamera: any, material: any
    let particleScene: any, particleCamera: any, points: any, pMat: any
    let pPos: Float32Array, pAttr: any, geo: any
    let raf = 0,
      frame = 0,
      mx = 0,
      my = 0
    let isDark = document.documentElement.classList.contains("dark") ? 1.0 : 0.0
    let visible = true

    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark") ? 1.0 : 0.0
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [
        "class",
      ],
    })

    // Pause when tab is hidden
    const onVisibility = () => {
      visible = !document.hidden
    }
    document.addEventListener("visibilitychange", onVisibility)

    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = -(e.clientY / window.innerHeight - 0.5) * 2
    }

    const N = 80 // reduced from 120
    const SPREAD_X = 160,
      SPREAD_Y = 120,
      HALF_Y = SPREAD_Y / 2
    let px0: Float32Array, vy: Float32Array, vx: Float32Array
    let swAmp: Float32Array, swFq: Float32Array, swPh: Float32Array, baseA: Float32Array
    let baseSz: Float32Array // pre-computed base sizes (no Math.random per frame)

    async function init() {
      THREE = await import("three")
      const w = window.innerWidth,
        h = window.innerHeight

      renderer = new THREE.WebGLRenderer({
        canvas: canvas!,
        alpha: true,
        antialias: false,
        powerPreference: "low-power", // prefer battery over performance
      })
      // Render at 75% resolution — shader is soft anyway
      const scale = 0.75
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio * scale, 1.0))
      renderer.autoClear = false

      // BG shader scene
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
          uDark: {
            value: isDark,
          },
        },
        depthTest: false,
        depthWrite: false,
      })
      bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

      // Particle scene
      particleScene = new THREE.Scene()
      particleCamera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000)
      particleCamera.position.set(0, 0, 100)

      // Smaller sprite texture (32x32 instead of 64x64)
      const spriteCanvas = document.createElement("canvas")
      spriteCanvas.width = spriteCanvas.height = 32
      const sc = spriteCanvas.getContext("2d")!
      const sg = sc.createRadialGradient(16, 16, 0, 16, 16, 16)
      sg.addColorStop(0, "rgba(255,255,255,1)")
      sg.addColorStop(0.3, "rgba(255,255,255,0.6)")
      sg.addColorStop(1, "rgba(255,255,255,0)")
      sc.fillStyle = sg
      sc.fillRect(0, 0, 32, 32)
      const sprite = new THREE.CanvasTexture(spriteCanvas)

      const PAL = [
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
      const pickColor = () => {
        const r = Math.random()
        return PAL[r < 0.35 ? 0 : r < 0.58 ? 1 : r < 0.72 ? 2 : r < 0.84 ? 3 : r < 0.95 ? 4 : 5]
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
      baseSz = new Float32Array(N)

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
        baseSz[i] = Math.random() < 0.04 ? 3.5 + Math.random() * 3 : 0.8 + Math.random() * 2.2
        sz[i] = baseSz[i]
        baseA[i] = 0.3 + Math.random() * 0.7
      }

      geo = new THREE.BufferGeometry()
      pAttr = new THREE.BufferAttribute(pPos, 3)
      pAttr.usage = THREE.DynamicDrawUsage
      geo.setAttribute("position", pAttr)
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3))
      const szAttr = new THREE.BufferAttribute(sz, 1)
      szAttr.usage = THREE.DynamicDrawUsage
      geo.setAttribute("size", szAttr)

      pMat = new THREE.PointsMaterial({
        map: sprite,
        vertexColors: true,
        size: 3,
        sizeAttenuation: true,
        transparent: true,
        opacity: isDark ? 0.35 : 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        alphaTest: 0.01,
      })
      points = new THREE.Points(geo, pMat)
      particleScene.add(points)

      document.addEventListener("mousemove", onMouseMove, {
        passive: true,
      })

      // Throttled to ~30fps
      let lastRender = 0
      const FRAME_INTERVAL = 1000 / 30

      function animate(now: number) {
        raf = requestAnimationFrame(animate)
        if (!visible) return
        if (now - lastRender < FRAME_INTERVAL) return
        lastRender = now

        frame++

        // Shader uniforms
        material.uniforms.uT.value = frame * 0.033 // adjusted for 30fps
        material.uniforms.uMouse.value.x += (mx - material.uniforms.uMouse.value.x) * 0.05
        material.uniforms.uMouse.value.y += (my - material.uniforms.uMouse.value.y) * 0.05
        material.uniforms.uDark.value += (isDark - material.uniforms.uDark.value) * 0.05

        // Particles — update every frame we render
        const szArr = geo.attributes.size.array as Float32Array
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
          szArr[i] = baseSz[i] * baseA[i] * breathe * Math.min(topFade, botFade)
        }
        pAttr.needsUpdate = true
        geo.attributes.size.needsUpdate = true

        // Theme-adaptive particle opacity
        pMat.opacity += ((isDark ? 0.35 : 0.08) - pMat.opacity) * 0.05

        // Mouse parallax
        points.rotation.y += (mx * 0.06 - points.rotation.y) * 0.03
        points.rotation.x += (-my * 0.04 - points.rotation.x) * 0.03
        particleCamera.position.x += (mx * 5 - particleCamera.position.x) * 0.02
        particleCamera.position.y += (-my * 3 - particleCamera.position.y) * 0.02
        particleCamera.lookAt(0, 0, 0)

        renderer.clear()
        renderer.render(bgScene, bgCamera)
        renderer.render(particleScene, particleCamera)
      }
      raf = requestAnimationFrame(animate)
    }

    init().catch(() => setUseFallback(true))

    const onResize = () => {
      if (!renderer) return
      const w = window.innerWidth,
        h = window.innerHeight
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
      document.removeEventListener("visibilitychange", onVisibility)
      themeObserver.disconnect()
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

export function HomeBgCanvas() {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const inset = document.querySelector("[data-slot='sidebar-inset']")
    const target = inset?.parentElement ?? document.body
    setPortalTarget(target)
  }, [])

  if (!portalTarget) return null
  return createPortal(<BgCanvasInner />, portalTarget)
}
