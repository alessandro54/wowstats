import { FRAME_INTERVAL, initParticles, PARTICLE_COUNT, updateParticle } from "./home-bg"
import BG_FS from "./shaders/home-bg.frag"
import BG_VS from "./shaders/home-bg.vert"
import PARTICLE_FS from "./shaders/particle.frag"
import PARTICLE_VS from "./shaders/particle.vert"

// --- Helpers ---

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)
  if (!s) throw new Error("createShader returned null")
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s) || "unknown error"
    gl.deleteShader(s)
    throw new Error(`Shader compile: ${log}\n--- source ---\n${src}`)
  }
  return s
}

function linkProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram {
  const p = gl.createProgram()!
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p)
    gl.deleteProgram(p)
    throw new Error(`Program link: ${log}`)
  }
  return p
}

function createSpriteTexture(gl: WebGLRenderingContext): WebGLTexture {
  const c = document.createElement("canvas")
  c.width = c.height = 32
  const ctx = c.getContext("2d")!
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  g.addColorStop(0, "rgba(255,255,255,1)")
  g.addColorStop(0.3, "rgba(255,255,255,0.6)")
  g.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 32, 32)

  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return tex
}

// --- Main renderer ---

export interface HomeBgRenderer {
  dispose: () => void
}

export function createHomeBgRenderer(
  canvas: HTMLCanvasElement,
  onFallback: () => void,
): HomeBgRenderer {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  })
  if (!gl) {
    console.warn("[HomeBg] getContext('webgl') returned null")
    onFallback()
    return {
      dispose: () => {},
    }
  }

  const scale = 0.75
  const dpr = Math.min(window.devicePixelRatio * scale, 1.0)

  function resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    canvas.style.width = w + "px"
    canvas.style.height = h + "px"
    gl!.viewport(0, 0, canvas.width, canvas.height)
  }
  resize()

  if (gl.isContextLost()) {
    onFallback()
    return {
      dispose: () => {},
    }
  }

  // --- BG program ---
  const bgProg = linkProgram(
    gl,
    compileShader(gl, gl.VERTEX_SHADER, BG_VS),
    compileShader(gl, gl.FRAGMENT_SHADER, BG_FS),
  )
  const bgPosAttr = gl.getAttribLocation(bgProg, "aPosition")
  const bgUniT = gl.getUniformLocation(bgProg, "uT")
  const bgUniRes = gl.getUniformLocation(bgProg, "uRes")
  const bgUniMouse = gl.getUniformLocation(bgProg, "uMouse")
  const bgUniDark = gl.getUniformLocation(bgProg, "uDark")

  // Fullscreen quad (2 triangles)
  const quadBuf = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      1,
    ]),
    gl.STATIC_DRAW,
  )

  // --- Particle program ---
  const ptProg = linkProgram(
    gl,
    compileShader(gl, gl.VERTEX_SHADER, PARTICLE_VS),
    compileShader(gl, gl.FRAGMENT_SHADER, PARTICLE_FS),
  )
  const ptAttrPos = gl.getAttribLocation(ptProg, "aPos")
  const ptAttrCol = gl.getAttribLocation(ptProg, "aCol")
  const ptAttrSize = gl.getAttribLocation(ptProg, "aSize")
  const ptUniViewport = gl.getUniformLocation(ptProg, "uViewport")
  const ptUniCamOff = gl.getUniformLocation(ptProg, "uCamOff")
  const ptUniRot = gl.getUniformLocation(ptProg, "uRot")
  const ptUniOpacity = gl.getUniformLocation(ptProg, "uOpacity")
  const ptUniSprite = gl.getUniformLocation(ptProg, "uSprite")

  const N = PARTICLE_COUNT
  const particles = initParticles(N)

  const posBuf = gl.createBuffer()!
  const colBuf = gl.createBuffer()!
  const sizeBuf = gl.createBuffer()!

  gl.bindBuffer(gl.ARRAY_BUFFER, colBuf)
  gl.bufferData(gl.ARRAY_BUFFER, particles.colors, gl.STATIC_DRAW)

  const spriteTex = createSpriteTexture(gl)

  // --- State ---
  let raf = 0
  let frame = 0
  let mx = 0,
    my = 0
  let smx = 0,
    smy = 0
  let isDark = document.documentElement.classList.contains("dark") ? 1.0 : 0.0
  let darkSmooth = isDark
  let visible = true
  let camX = 0,
    camY = 0,
    rotX = 0,
    rotY = 0
  let particleOpacity = isDark ? 0.35 : 0.08

  const themeObs = new MutationObserver(() => {
    isDark = document.documentElement.classList.contains("dark") ? 1.0 : 0.0
  })
  themeObs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [
      "class",
    ],
  })

  const onVis = () => {
    visible = !document.hidden
  }
  document.addEventListener("visibilitychange", onVis)

  const onMouse = (e: MouseEvent) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2
    my = -(e.clientY / window.innerHeight - 0.5) * 2
  }
  document.addEventListener("mousemove", onMouse, {
    passive: true,
  })

  const onResize = () => resize()
  window.addEventListener("resize", onResize)

  // --- Render functions ---

  function renderBg() {
    gl!.useProgram(bgProg)
    gl!.disable(gl!.BLEND)

    // Disable particle attribs that may still be enabled
    gl!.disableVertexAttribArray(ptAttrPos)
    gl!.disableVertexAttribArray(ptAttrCol)
    gl!.disableVertexAttribArray(ptAttrSize)

    gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuf)
    gl!.enableVertexAttribArray(bgPosAttr)
    gl!.vertexAttribPointer(bgPosAttr, 2, gl!.FLOAT, false, 0, 0)
    gl!.uniform1f(bgUniT, frame * 0.033)
    gl!.uniform2f(bgUniRes, canvas.width, canvas.height)
    gl!.uniform2f(bgUniMouse, smx, smy)
    gl!.uniform1f(bgUniDark, darkSmooth)
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
    gl!.disableVertexAttribArray(bgPosAttr)
  }

  function renderParticles() {
    gl!.useProgram(ptProg)
    gl!.enable(gl!.BLEND)
    gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE) // additive

    gl!.uniform2f(ptUniViewport, canvas.width, canvas.height)
    gl!.uniform2f(ptUniCamOff, -camX, -camY)
    gl!.uniform2f(ptUniRot, rotY, rotX)
    gl!.uniform1f(ptUniOpacity, particleOpacity)

    gl!.activeTexture(gl!.TEXTURE0)
    gl!.bindTexture(gl!.TEXTURE_2D, spriteTex)
    gl!.uniform1i(ptUniSprite, 0)

    gl!.bindBuffer(gl!.ARRAY_BUFFER, posBuf)
    gl!.bufferData(gl!.ARRAY_BUFFER, particles.positions, gl!.DYNAMIC_DRAW)
    gl!.enableVertexAttribArray(ptAttrPos)
    gl!.vertexAttribPointer(ptAttrPos, 3, gl!.FLOAT, false, 0, 0)

    gl!.bindBuffer(gl!.ARRAY_BUFFER, colBuf)
    gl!.enableVertexAttribArray(ptAttrCol)
    gl!.vertexAttribPointer(ptAttrCol, 3, gl!.FLOAT, false, 0, 0)

    gl!.bindBuffer(gl!.ARRAY_BUFFER, sizeBuf)
    gl!.bufferData(gl!.ARRAY_BUFFER, particles.sizes, gl!.DYNAMIC_DRAW)
    gl!.enableVertexAttribArray(ptAttrSize)
    gl!.vertexAttribPointer(ptAttrSize, 1, gl!.FLOAT, false, 0, 0)

    gl!.drawArrays(gl!.POINTS, 0, N)
    gl!.disableVertexAttribArray(ptAttrPos)
    gl!.disableVertexAttribArray(ptAttrCol)
    gl!.disableVertexAttribArray(ptAttrSize)
    gl!.disable(gl!.BLEND)
  }

  // --- Main loop ---

  let lastRender = 0

  function animate(now: number) {
    raf = requestAnimationFrame(animate)
    if (!visible) return
    if (now - lastRender < FRAME_INTERVAL) return
    lastRender = now
    frame++

    smx += (mx - smx) * 0.05
    smy += (my - smy) * 0.05
    darkSmooth += (isDark - darkSmooth) * 0.05

    for (let i = 0; i < N; i++) {
      updateParticle(i, particles, frame)
    }

    particleOpacity += ((isDark ? 0.35 : 0.08) - particleOpacity) * 0.05

    // Mouse parallax
    rotY += (mx * 0.06 - rotY) * 0.03
    rotX += (-my * 0.04 - rotX) * 0.03
    camX += (mx * 5 - camX) * 0.02
    camY += (-my * 3 - camY) * 0.02

    gl!.clear(gl!.COLOR_BUFFER_BIT)
    renderBg()
    renderParticles()
  }

  gl.clearColor(0, 0, 0, 0)
  raf = requestAnimationFrame(animate)

  return {
    dispose() {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("mousemove", onMouse)
      document.removeEventListener("visibilitychange", onVis)
      themeObs.disconnect()
      // Don't loseContext() — React strict mode re-runs effects on the same
      // canvas element, and a lost context can't be reacquired.
    },
  }
}
