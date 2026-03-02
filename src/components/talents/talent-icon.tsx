"use client"

import type React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { MetaTalent } from "@/lib/api"

export function TalentIcon({
  talent,
  size,
  activeColor,
  borderClass,
  tooltipContent,
}: {
  talent:          MetaTalent
  size:            number
  activeColor:     string
  /** Tailwind border-color class(es) — supports dark: variants for light/dark mode.
   *  Falls back to activeColor via inline style when not provided. */
  borderClass?:    string
  tooltipContent?: React.ReactNode
}) {
  const icon = (
    <div
      id={`talent-${talent.talent.blizzard_id}`}
      className={cn("relative rounded overflow-hidden border-2 shrink-0 cursor-default", borderClass)}
      style={{ width: size, height: size, ...(!borderClass && { borderColor: activeColor }) }}
    >
      {talent.talent.icon_url ? (
        <Image
          src={talent.talent.icon_url}
          alt={talent.talent.name}
          width={size}
          height={size}
          className="object-cover"
          unoptimized
        />
      ) : (
        <div
          className="w-full h-full rounded"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
      )}
    </div>
  )

  if (!tooltipContent) return icon

  return (
    <Tooltip>
      <TooltipTrigger asChild>{icon}</TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  )
}
