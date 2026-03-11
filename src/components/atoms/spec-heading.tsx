"use client"

import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { usePathname } from "next/navigation"

interface Props {
  className: string
  classSlug: WowClassSlug
  specSlug: string
}

function isSoloShuffle(bracketSlug: string) {
  return bracketSlug.toLowerCase().includes("shuffle")
}

export function SpecHeading({ className, classSlug, specSlug }: Props) {
  const bracket = usePathname().split("/")[4] ?? ""
  return (
    <div>
      <h1
        className="text-lg md:text-2xl font-bold capitalize"
        style={{
          color: `var(--color-class-${classSlug})`,
        }}
      >
        {className}
        {" • "}
        {specSlug}
      </h1>
      <p className="text-muted-foreground text-xs md:text-sm capitalize">
        {isSoloShuffle(bracket) ? "Solo Shuffle" : bracket} · PvP
      </p>
    </div>
  )
}
