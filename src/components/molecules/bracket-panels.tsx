"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { BRACKETS } from "@/config/wow/brackets-config"

interface BracketPanelsProps {
  classSlug: string
  specSlug: string
  classColor: string
}

export function BracketPanels({ classSlug, specSlug, classColor }: BracketPanelsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {BRACKETS.map((bracket) => (
        <Link
          key={bracket.slug}
          href={`/pvp/${classSlug}/${specSlug}/${bracket.slug}`}
          className="group rounded-xl border border-border/50 bg-card/30 px-5 py-5 transition-all hover:scale-[1.02] hover:bg-card/60"
          style={
            {
              "--panel-color": classColor,
            } as React.CSSProperties
          }
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p
                className="text-lg font-bold"
                style={{
                  color: classColor,
                }}
              >
                {bracket.label}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{bracket.description}</p>
            </div>
            <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
          </div>
        </Link>
      ))}
    </div>
  )
}
