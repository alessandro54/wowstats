"use client"

import { useEffect, useState, useRef } from "react"

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
      className="pointer-events-none absolute inset-x-0 bottom-8 z-[3] flex flex-col items-center gap-3 opacity-40"
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Scroll
      </span>
      <div className="relative h-8 w-px overflow-hidden">
        <div className="animate-scroll-line absolute inset-x-0 top-0 h-full bg-gradient-to-b from-primary to-transparent" />
      </div>
    </div>
  )
}
