"use client"

import type { ReactNode } from "react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

const CARD_OFFSET = 16
const CARD_MAX_H = 480
const EDGE_PADDING = 8

export function CursorTooltipCard({
  children,
  pos,
  borderColor,
  interactive,
}: {
  children: ReactNode
  pos: {
    x: number
    y: number
  }
  borderColor?: string
  interactive: boolean
}) {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [coords, setCoords] = useState<{
    left: number
    top: number
  } | null>(null)

  useEffect(() => setTarget(document.body), [])

  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    const w = el.offsetWidth
    const h = el.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight

    let left = pos.x + CARD_OFFSET
    if (left + w + EDGE_PADDING > vw) left = pos.x - CARD_OFFSET - w
    left = Math.max(EDGE_PADDING, Math.min(left, vw - w - EDGE_PADDING))

    let top = pos.y + CARD_OFFSET
    if (top + h + EDGE_PADDING > vh) top = pos.y - CARD_OFFSET - h
    top = Math.max(EDGE_PADDING, Math.min(top, vh - h - EDGE_PADDING))

    setCoords({
      left,
      top,
    })
  }, [
    pos.x,
    pos.y,
  ])

  if (!target) return null

  return createPortal(
    <div
      ref={cardRef}
      data-cursor-tooltip-card=""
      className={`fixed z-[1000] rounded-xl border bg-popover/95 p-3 shadow-xl backdrop-blur-md ${interactive ? "" : "pointer-events-none"}`}
      style={{
        left: coords?.left ?? -9999,
        top: coords?.top ?? -9999,
        maxHeight: CARD_MAX_H,
        visibility: coords ? "visible" : "hidden",
        borderColor: borderColor ?? "var(--color-border)",
      }}
    >
      {children}
    </div>,
    target,
  )
}
