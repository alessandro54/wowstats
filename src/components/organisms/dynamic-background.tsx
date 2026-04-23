"use client"

import { usePathname } from "next/navigation"
import { useHoverSlug } from "@/components/providers/hover-provider"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"

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

  // Spec pages handle their own atmosphere via layout; home has its own canvas
  if (isHome || isSpecPage) return null

  return (
    <>
      <div
        className="animate-blob animation-delay-6000 pointer-events-none fixed -top-[40vw] left-1/2 h-[50vw] w-[90vw] -translate-x-1/2 overflow-hidden rounded-full opacity-15 blur-3xl filter transition-all duration-700 ease-in-out"
        style={{
          zIndex: -1,
          background,
        }}
      />
      {isSpecPage && (
        <div
          className={`pointer-events-none fixed inset-x-0 bottom-0 h-96 transition-all duration-700 spec-${classSlug}-${specSlug}`}
          style={{
            zIndex: -1,
            backgroundImage:
              "linear-gradient(to top, oklch(from var(--spec-color) l c h / 0.18), transparent)",
          }}
        />
      )}
    </>
  )
}
