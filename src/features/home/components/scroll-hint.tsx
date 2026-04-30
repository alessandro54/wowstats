"use client"

import { useEffect, useRef, useState } from "react"

export function ScrollHint() {
  const [visible, setVisible] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Find actual scroll container by walking up
    let el: HTMLElement | null =
      (document.querySelector("[data-slot='sidebar-inset']") as HTMLElement) ?? null

    if (!el && ref.current) {
      let parent: HTMLElement | null = ref.current.parentElement
      while (parent) {
        const style = getComputedStyle(parent)
        if (style.overflowY === "auto" || style.overflowY === "scroll") {
          el = parent
          break
        }
        parent = parent.parentElement
      }
    }

    if (!el) return

    const handler = () => setVisible(el!.scrollTop < 80)
    el.addEventListener("scroll", handler, {
      passive: true,
    })
    handler()
    return () => el!.removeEventListener("scroll", handler)
  }, [])

  if (!visible) return null

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 bottom-8 z-[3] flex flex-col items-center gap-2 opacity-75"
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/70">
        Scroll
      </span>
      <div className="relative h-10 w-px overflow-hidden">
        <div className="animate-scroll-line absolute inset-x-0 top-0 h-full bg-gradient-to-b from-primary via-primary/60 to-transparent" />
      </div>
      <svg
        className="animate-bounce text-primary/70"
        width="12"
        height="8"
        viewBox="0 0 12 8"
        fill="none"
      >
        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}
