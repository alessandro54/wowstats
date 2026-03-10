"use client"

import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { usePathname } from "next/navigation"
import { useHoverSlug } from "@/components/providers/hover-provider"

export default function DynamicBackground() {
  const hoverSlug = useHoverSlug()
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)
  // Routes: /pvp/[classSlug]/[specSlug]/[bracket]
  const isPvpRoute = segments[0] === "pvp"
  const classSlug = ((isPvpRoute ? segments[1] : segments[0]) as WowClassSlug | undefined) ?? null
  const specSlug = (isPvpRoute ? segments[2] : segments[1]) ?? null
  const isSpecPage = isPvpRoute && classSlug && specSlug

  const isRoot = pathname === "/"
  const activeSlug = hoverSlug ?? classSlug
  const background = activeSlug ? `var(--color-class-${activeSlug})` : "oklch(0.7 0.15 340)"

  return (
    <>
      {/* Class color — top center blob */}
      <div
        className="animate-blob animation-delay-6000 pointer-events-none fixed -top-[40vw] left-1/2 h-[50vw] w-[90vw] -translate-x-1/2 overflow-hidden rounded-full opacity-15 blur-3xl filter transition-all duration-700 ease-in-out"
        style={{
          zIndex: -1,
          background,
        }}
      />
      {/* Spec color — bottom center gradient (only on spec pages) */}
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
