"use client"

import { TransitionLink as Link } from "@/components/atoms/transition-link"
import { usePathname } from "next/navigation"
import { BRACKETS } from "@/config/wow/brackets-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { useActiveColor } from "@/hooks/use-active-color"

interface Props {
  classSlug: WowClassSlug
  specSlug: string
}

export function BracketSelector({ classSlug, specSlug }: Props) {
  const activeColor = useActiveColor(classSlug)
  const pathname = usePathname()
  const currentBracket = pathname.split("/")[4] ?? ""

  return (
    <div className="flex gap-1">
      {BRACKETS.map((b) => {
        const isActive = b.slug === currentBracket
        return (
          <Link
            key={b.slug}
            href={`/pvp/${classSlug}/${specSlug}/${b.slug}`}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors duration-700 ${isActive ? "class-pill" : "bracket-inactive"}`}
            style={
              {
                "--pill-color": activeColor,
              } as React.CSSProperties
            }
          >
            {b.label}
          </Link>
        )
      })}
    </div>
  )
}
