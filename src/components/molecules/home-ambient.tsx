"use client"

import { useHoverSlug } from "@/components/providers/hover-provider"

export function HomeAmbient() {
  const hoverSlug = useHoverSlug()
  const color = hoverSlug ? `var(--color-class-${hoverSlug})` : "rgb(249, 115, 22)"

  return (
    <div
      className="pointer-events-none absolute overflow-hidden"
      style={{
        zIndex: 0,
        top: 0,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100vw",
      }}
    >
      {/* Primary blob — slow drift top-right */}
      <div
        className="absolute aspect-square w-[60vw] rounded-full animate-blob-drift-1"
        style={{
          background: color,
          opacity: 0.08,
          filter: "blur(160px)",
          top: "-30%",
          right: "-15%",
          transition: "background 1.5s ease-in-out",
        }}
      />
      {/* Secondary blob — slow drift bottom-left */}
      <div
        className="absolute aspect-square w-[50vw] rounded-full animate-blob-drift-2"
        style={{
          background: color,
          opacity: 0.06,
          filter: "blur(160px)",
          bottom: "-25%",
          left: "-15%",
          transition: "background 1.5s ease-in-out",
        }}
      />
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  )
}
