"use client"

import { usePathname } from "next/navigation"
import { HomeBgCanvas } from "@/features/home/components/home-bg-canvas"
import { useHoverSlug } from "@/components/providers/hover-provider"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { bracketColor } from "@/config/wow/brackets-config"

export default function DynamicBackground() {
  const hoverSlug = useHoverSlug()
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)
  const isPvpRoute = segments[0] === "pvp"
  const isMetaPage = isPvpRoute && segments[1] === "meta"
  const classSlug =
    isPvpRoute && !isMetaPage ? ((segments[1] as WowClassSlug | undefined) ?? null) : null
  const specSlug = isPvpRoute && !isMetaPage ? (segments[2] ?? null) : null
  const isSpecPage = isPvpRoute && !isMetaPage && classSlug && specSlug

  const isHome = pathname === "/"
  const activeSlug = hoverSlug ?? classSlug
  const background = activeSlug ? `var(--color-class-${activeSlug})` : "oklch(0.7 0.15 340)"

  // bracket slug sits at segments[2] for /pvp/meta/[bracket]/[role]
  const bracketSlug = isMetaPage ? segments[2] : null
  const bracketColorVal = bracketSlug ? bracketColor(bracketSlug) : undefined

  // Home has its own canvas; spec pages have their own atmosphere
  if (isHome || isSpecPage) return null

  if (isMetaPage) {
    // Hover overrides bracket color for live class tinting
    const bgColor = activeSlug ? `var(--color-class-${activeSlug})` : bracketColorVal
    return <HomeBgCanvas color={bgColor} />
  }

  return (
    <div
      className="animate-blob animation-delay-6000 pointer-events-none fixed -top-[40vw] left-1/2 h-[50vw] w-[90vw] -translate-x-1/2 overflow-hidden rounded-full opacity-15 blur-3xl filter transition-all duration-700 ease-in-out"
      style={{
        zIndex: -1,
        background,
      }}
    />
  )
}
