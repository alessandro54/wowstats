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
}) {
  const icon = (
    <div
      id={`talent-${talent.talent.blizzard_id}`}
      className="relative shrink-0 cursor-default rounded"
      style={{ width: size, height: size }}
    >
      {/* Image layer — overflow-hidden kept here so the icon stays fully visible */}
      <div className="absolute inset-0 overflow-hidden rounded">
        {talent.talent.icon_url
          ? (
              <Image
                src={talent.talent.icon_url}
                alt={talent.talent.name}
                width={size}
                height={size}
                className="object-cover"
                unoptimized
              />
            )
          : (
              <div className="h-full w-full rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
            )}
      </div>

      {/* Border overlay — diagonally clipped to right+bottom when partially ranked */}
      <div
        className={cn("pointer-events-none absolute inset-0 rounded", borderClass ?? "border-2")}
        style={{
          ...(partialRank && { clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }),
          ...(!borderClass && { borderColor: activeColor }),
        }}
      />
    </div>
  )

  if (!tooltipContent)
    return icon

  return (
    <ClickableTooltip content={tooltipContent} side="top" align="center">
      {icon}
    </ClickableTooltip>
  )
}
