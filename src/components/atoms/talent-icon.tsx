"use client"

import type * as React from "react"
import type { MetaTalent } from "@/lib/api"
import Image from "next/image"
import { ClickableTooltip } from "@/components/atoms/clickable-tooltip"
import { cn } from "@/lib/utils"

export function TalentIcon({
  talent,
  size,
  activeColor,
  borderClass,
  tooltipContent,
  partialRank,
  isApex,
  glowing,
}: {
  talent: MetaTalent
  size: number
  activeColor: string
  /**
   * Tailwind border-color class(es) — supports dark: variants for light/dark mode.
   *  Falls back to activeColor via inline style when not provided.
   */
  borderClass?: string
  tooltipContent?: React.ReactNode
  /**
   * When true the border is diagonally clipped to show only the right + bottom
   *  sides, forming a 90° corner — indicates the talent is partially ranked in
   *  the top build (e.g. 1/2 ranks taken).
   */
  partialRank?: boolean
  isApex?: boolean
  glowing?: boolean
}) {
  const radius = isApex ? "rounded-full" : "rounded"
  const icon = (
    <div
      id={`talent-${talent.talent.blizzard_id}`}
      className={cn("relative shrink-0 cursor-default", radius, glowing && "animate-talent-glow")}
      style={{
        width: size,
        height: size,
        ...(glowing &&
          ({
            "--glow-color": activeColor,
          } as React.CSSProperties)),
      }}
    >
      {/* Image layer — overflow-hidden kept here so the icon stays fully visible */}
      <div className={cn("absolute inset-0 overflow-hidden", radius)}>
        {talent.talent.icon_url ? (
          <Image
            src={talent.talent.icon_url}
            alt={talent.talent.name || "Talent Icon"}
            width={size}
            height={size}
            className="object-cover"
            unoptimized
          />
        ) : (
          <div
            className={cn("h-full w-full", radius)}
            style={{
              background: "rgba(255,255,255,0.08)",
            }}
          />
        )}
      </div>

      {/* Border overlay — diagonally clipped to right+bottom when partially ranked */}
      <div
        className={cn("pointer-events-none absolute inset-0", radius, borderClass ?? "border-2")}
        style={{
          ...(partialRank && {
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }),
          ...(!borderClass && {
            borderColor: activeColor,
          }),
        }}
      />
    </div>
  )

  if (!tooltipContent) return icon

  return (
    <ClickableTooltip content={tooltipContent} side="top" align="center">
      {icon}
    </ClickableTooltip>
  )
}
