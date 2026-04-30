"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { CssFallbackBg } from "@/components/atoms/css-fallback-bg"
import { createHomeBgRenderer } from "@/lib/fx/home-bg-webgl"

function resolveCssColor(css: string):
  | [
      number,
      number,
      number,
    ]
  | undefined {
  try {
    const el = document.createElement("div")
    el.style.color = css
    el.style.position = "absolute"
    el.style.visibility = "hidden"
    document.body.appendChild(el)
    const computed = getComputedStyle(el).color
    document.body.removeChild(el)
    const m = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (!m) return undefined
    return [
      parseInt(m[1]) / 255,
      parseInt(m[2]) / 255,
      parseInt(m[3]) / 255,
    ]
  } catch {
    return undefined
  }
}

export function BgCanvasInner({ color }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<ReturnType<typeof createHomeBgRenderer> | null>(null)
  const [useFallback, setUseFallback] = useState(false)

  // Mount once — create renderer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resolved = color ? resolveCssColor(color) : undefined
    let renderer: ReturnType<typeof createHomeBgRenderer>
    try {
      renderer = createHomeBgRenderer(
        canvas,
        () => setUseFallback(true),
        resolved
          ? {
              color: resolved,
            }
          : undefined,
      )
    } catch (e) {
      console.error("[HomeBg]", e)
      setUseFallback(true)
      return
    }
    rendererRef.current = renderer
    return () => {
      renderer.dispose()
      rendererRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Color changes — lerp to new color without recreating
  useEffect(() => {
    if (!color) return
    const resolved = resolveCssColor(color)
    if (resolved) rendererRef.current?.setColor(...resolved)
  }, [
    color,
  ])

  if (useFallback) return <CssFallbackBg />

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{
        zIndex: -1,
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}

export function HomeBgCanvas({ color }: { color?: string } = {}) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const inset = document.querySelector("[data-slot='sidebar-inset']")
    const target = inset?.parentElement ?? document.body
    setPortalTarget(target)
  }, [])

  if (!portalTarget) return null
  return createPortal(<BgCanvasInner color={color} />, portalTarget)
}
