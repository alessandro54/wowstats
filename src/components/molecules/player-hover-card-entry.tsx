"use client"

import { LazyImage } from "@/components/atoms/lazy-image"
import { bracketColor } from "@/config/wow/brackets-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import { classColor } from "@/hooks/use-active-color"
import type { CharacterProfile } from "@/lib/api"
import { winRate } from "@/lib/utils"

export function bracketOrder(slug: string): number {
  if (slug === "2v2") return 0
  if (slug === "3v3") return 1
  if (slug.startsWith("shuffle")) return 2
  if (slug.startsWith("blitz")) return 3
  return 4
}

interface BracketParts {
  label: string
  specIcon: string | null
  specName: string | null
}

function parseBracket(slug: string, specId: number | null): BracketParts {
  let specName: string | null = null
  let specIcon: string | null = null
  if (specId != null) {
    for (const c of WOW_CLASSES) {
      const s = c.specs.find((sp) => sp.id === specId)
      if (s) {
        specName = s.name
        specIcon = s.iconUrl
        break
      }
    }
  }
  if (slug.startsWith("shuffle"))
    return {
      label: "Shuffle",
      specIcon,
      specName,
    }
  if (slug.startsWith("blitz"))
    return {
      label: "Blitz",
      specIcon,
      specName,
    }
  return {
    label: slug.toUpperCase(),
    specIcon: null,
    specName: null,
  }
}

export function PlayerEntryRow({
  entry,
  fallbackClass,
}: {
  entry: CharacterProfile["pvp_entries"][number]
  fallbackClass: WowClassSlug | undefined
}) {
  const wr = winRate(entry.wins, entry.losses)
  const wrNum = entry.wins + entry.losses > 0 ? (entry.wins / (entry.wins + entry.losses)) * 100 : 0
  const parts = parseBracket(entry.bracket, entry.spec_id ?? null)
  const color = bracketColor(entry.bracket)
  const wrColor = wrNum >= 60 ? "var(--color-stat-versatility)" : "var(--color-muted-foreground)"

  return (
    <div className="flex items-center justify-between gap-2 text-[11px]">
      <div className="flex min-w-0 items-center gap-1.5">
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={{
            backgroundColor: `color-mix(in oklch, ${color} 18%, transparent)`,
            color,
          }}
        >
          {parts.label}
        </span>
        {parts.specIcon && (
          <LazyImage
            src={parts.specIcon}
            alt=""
            width={14}
            height={14}
            className="shrink-0 rounded-sm"
          />
        )}
        {parts.specName && (
          <span
            className="truncate capitalize"
            style={{
              color: classColor(fallbackClass),
            }}
          >
            {parts.specName}
          </span>
        )}
      </div>
      <span className="flex shrink-0 items-center gap-2 tabular-nums">
        <span className="font-semibold text-foreground">{entry.rating}</span>
        <span className="text-[10px] text-muted-foreground">
          {entry.wins}-{entry.losses}
        </span>
        <span
          className="text-[10px] font-semibold"
          style={{
            color: wrColor,
          }}
        >
          {wr}
        </span>
      </span>
    </div>
  )
}
