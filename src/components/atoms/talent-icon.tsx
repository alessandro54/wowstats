"use client"

import Image from "next/image"
import type * as React from "react"
import { ClickableTooltip } from "@/components/atoms/clickable-tooltip"
import type { MetaTalent } from "@/lib/api"
import { iconUrl } from "@/config/cdn-config"
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
  glowIntensity,
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
  /** 0–1 intensity for static glow (no animation). 0 = off, 1 = full brightness. */
  glowIntensity?: number
}) {
  const radius = isApex ? "rounded-full" : "rounded"
  const hasStaticGlow = !glowing && (glowIntensity ?? 0) > 0
  const icon = (
    <div
      id={`talent-${talent.talent.blizzard_id}`}
      className={cn("relative shrink-0 cursor-default", radius, glowing && "animate-talent-glow")}
      style={{
        width: size,
        height: size,
        ...((glowing || hasStaticGlow) &&
          ({
            "--glow-color": activeColor,
          } as React.CSSProperties)),
        ...(hasStaticGlow && {
          boxShadow: `0 0 ${4 + (glowIntensity ?? 0) * 8}px ${1 + (glowIntensity ?? 0) * 2}px ${activeColor}, 0 0 ${8 + (glowIntensity ?? 0) * 14}px ${2 + (glowIntensity ?? 0) * 4}px color-mix(in srgb, ${activeColor} ${Math.round(20 + (glowIntensity ?? 0) * 30)}%, transparent)`,
        }),
      }}
    >
      {/* Image layer — overflow-hidden kept here so the icon stays fully visible.
          Keyed by icon_url so swapping between hero trees of the same class
          (TalentTree's nodeKeyMode="position") triggers a per-icon fade-in
          animation. Caller is responsible for warming the cache (e.g.
          HeroSection preloads sibling tree icons) so the remount doesn't
          paint empty before the cached bytes arrive.                       */}
      <div className={cn("absolute inset-0 overflow-hidden", radius)}>
        {talent.talent.icon_url ? (
          <Image
            key={talent.talent.icon_url}
            src={iconUrl(talent.talent.icon_url, size)!}
            alt={talent.talent.name || "Talent Icon"}
            width={size}
            height={size}
            className="object-cover motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
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
