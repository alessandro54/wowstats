"use client"

import { useEffect, useRef } from "react"

interface Props {
  children: React.ReactNode
  className?: string
}

export function StickySpecHeader({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const container = el?.parentElement
    if (!el || !container) return // v8 ignore next

    const onScroll = () => {
      const t = Math.min(container.scrollTop / 80, 1)
      el.style.setProperty("--header-bg-opacity", String(t * 0.75))
      el.style.backdropFilter = t > 0.05 ? `blur(${t * 12}px)` : "none"
    }

    container.addEventListener("scroll", onScroll, {
      passive: true,
    })
    return () => container.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
