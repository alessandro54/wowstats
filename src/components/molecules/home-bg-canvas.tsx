"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { CssFallbackBg } from "@/components/atoms/css-fallback-bg"
import { createHomeBgRenderer } from "@/lib/fx/home-bg-webgl"

export function BgCanvasInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: ReturnType<typeof createHomeBgRenderer>
    try {
      renderer = createHomeBgRenderer(canvas, () => setUseFallback(true))
    } catch (e) {
      console.error("[HomeBg]", e)
      setUseFallback(true)
      return
    }
    return () => renderer.dispose()
  }, [])

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
