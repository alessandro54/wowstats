"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { BRACKETS } from "@/config/wow/brackets-config"

interface BracketPanelsProps {
  classSlug: string
  specSlug: string
  classColor: string
}

export function BracketPanels({ classSlug, specSlug, classColor }: BracketPanelsProps) {
  const [active, setActive] = useState<string | null>(null)

  function handleClick(slug: string, e: React.MouseEvent) {
    // On touch devices (hover: none), first tap expands, second tap navigates
    const isTouch = window.matchMedia("(hover: none)").matches
    if (isTouch && active !== slug) {
      e.preventDefault()
      setActive(slug)
    }
  }

  return (
    <div
      className="flex h-44 gap-2"
      onMouseLeave={() => setActive(null)}
    >
      {BRACKETS.map(bracket => {
        const isActive = active === bracket.slug
        const hasActive = active !== null

        return (
          <Link
            key={bracket.slug}
            href={`/pvp/${classSlug}/${specSlug}/${bracket.slug}`}
            onMouseEnter={() => setActive(bracket.slug)}
            onClick={(e) => handleClick(bracket.slug, e)}
            style={{ color: classColor }}
            className={cn(
              "group relative flex flex-col justify-end overflow-hidden rounded-xl border bg-card transition-all duration-300 ease-in-out",
              isActive
                ? "flex-5 border-primary/40 bg-card/90"
                : hasActive
                  ? "flex-1 border-border/50 opacity-60"
                  : "flex-1 border-border",
            )}
          >
            {/* Collapsed label — rotated when narrow */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                isActive ? "opacity-0 pointer-events-none" : "opacity-100",
              )}
            >
              <span
                className="whitespace-nowrap text-sm font-semibold -rotate-90 select-none"
                style={{ color: classColor }}
              >
                {bracket.label}
              </span>
            </div>

            {/* Expanded content */}
            <div
              className={cn(
                "p-4 transition-all duration-300",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xl font-bold" style={{ color: classColor }}>
                  {bracket.label}
                </p>
                <ChevronRight
                  className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{bracket.description}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
