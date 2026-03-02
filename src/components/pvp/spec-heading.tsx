"use client"

import { usePathname } from "next/navigation"
import type { WowClassSlug } from "@/config/wow/classes"

type Props = {
  className: string
  classSlug: WowClassSlug
  specSlug: string
}

function isSoloShuffle(bracketSlug: string) {
  return bracketSlug.toLowerCase().includes('shuffle')
}


export function SpecHeading({ className, classSlug, specSlug }: Props) {
  const bracket = usePathname().split('/')[4] ?? ''
  return (
    <div>
      <h1 className="text-2xl font-bold capitalize" style={{ color: `var(--color-class-${classSlug})` }}>
        {className} — {specSlug}
      </h1>
      <p className="text-sm text-muted-foreground capitalize">
        {isSoloShuffle(bracket) ? 'Solo Shuffle' : bracket} · PvP
      </p>
    </div>
  )
}
