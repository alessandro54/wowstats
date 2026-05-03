"use client"

import type { ReactElement, ReactNode } from "react"
import { cloneElement, isValidElement, useEffect, useRef, useState } from "react"
import { CursorTooltipCard } from "@/components/atoms/cursor-tooltip-card"

const HOVER_DELAY_MS = 80

interface Props {
  children: ReactNode
  content: ReactNode
  borderColor?: string
}

/**
 * Cursor-following tooltip. Desktop: hover next to cursor, follows, leaves on
 * exit. Touch: tap to open (pinned), tap outside to close.
 */
export function CursorTooltip({ children, content, borderColor }: Props) {
  const [pos, setPos] = useState<{
    x: number
    y: number
  } | null>(null)
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const touchedRef = useRef(false)
  const timerRef = useRef<number | null>(null)

  const start = (e: React.MouseEvent) => {
    if (touchedRef.current) return
    setPos({
      x: e.clientX,
      y: e.clientY,
    })
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setOpen(true), HOVER_DELAY_MS)
  }
  const move = (e: React.MouseEvent) => {
    if (touchedRef.current) return
    setPos({
      x: e.clientX,
      y: e.clientY,
    })
  }
  const end = () => {
    if (touchedRef.current) return
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setOpen(false)
    setPos(null)
  }
  const onTouchStart = (e: React.TouchEvent) => {
    touchedRef.current = true
    const t = e.touches[0]
    if (!t) return
    setPos({
      x: t.clientX,
      y: t.clientY,
    })
    if (pinned) {
      setPinned(false)
      setOpen(false)
      setPos(null)
    } else {
      setPinned(true)
      setOpen(true)
    }
  }
  const onClick = (e: React.MouseEvent) => {
    if (touchedRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  useEffect(() => {
    if (!pinned) return
    const close = (e: Event) => {
      const t = e.target as HTMLElement | null
      if (t?.closest("[data-cursor-tooltip-card]") || t?.closest("[data-cursor-tooltip-trigger]")) {
        return
      }
      setPinned(false)
      setOpen(false)
      setPos(null)
    }
    const timer = window.setTimeout(() => {
      document.addEventListener("touchstart", close)
      document.addEventListener("mousedown", close)
    }, 0)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener("touchstart", close)
      document.removeEventListener("mousedown", close)
    }
  }, [
    pinned,
  ])

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    },
    [],
  )

  if (!isValidElement<Record<string, unknown>>(children)) return null

  const child = children as ReactElement<Record<string, unknown>>
  const childProps = child.props
  const merged: Record<string, unknown> = {
    onMouseEnter: chain(
      childProps.onMouseEnter as ((e: React.MouseEvent) => void) | undefined,
      start,
    ),
    onMouseMove: chain(childProps.onMouseMove as ((e: React.MouseEvent) => void) | undefined, move),
    onMouseLeave: chain(childProps.onMouseLeave as (() => void) | undefined, end),
    onTouchStart: chain(
      childProps.onTouchStart as ((e: React.TouchEvent) => void) | undefined,
      onTouchStart,
    ),
    onClick: chain(onClick, childProps.onClick as ((e: React.MouseEvent) => void) | undefined),
    "data-cursor-tooltip-trigger": "",
  }

  return (
    <>
      {cloneElement(child, merged)}
      {open && pos && (
        <CursorTooltipCard pos={pos} borderColor={borderColor} interactive={pinned}>
          {content}
        </CursorTooltipCard>
      )}
    </>
  )
}

function chain<E>(...fns: (((e: E) => void) | undefined)[]) {
  return (e: E) => {
    for (const fn of fns) fn?.(e)
  }
}
