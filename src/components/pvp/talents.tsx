"use client"

import { useActiveColor } from "@/hooks/use-active-color"
import type { WowClassSlug } from "@/config/wow/classes"
import type { MetaTalent } from "@/lib/api"

const TYPE_ORDER = ["spec", "class", "hero", "pvp"]
const TYPE_LABELS: Record<string, string> = {
  spec:  "Spec Talents",
  class: "Class Talents",
  hero:  "Hero Talents",
  pvp:   "PvP Talents",
}

type Props = {
  classSlug: WowClassSlug
  talents: MetaTalent[]
}

export function Talents({ classSlug, talents }: Props) {
  const activeColor = useActiveColor(classSlug)

  if (talents.length === 0) return null

  const byType = Map.groupBy(talents, (t) => t.talent.talent_type)
  const groups = TYPE_ORDER.flatMap((type) => {
    const entries = byType.get(type)
    return entries ? [{ type, entries }] : []
  })

  return (
    <div className="space-y-8">
      {groups.map(({ type, entries }) => (
        <section key={type} className="space-y-3">
          <h2 className="text-lg font-semibold">{TYPE_LABELS[type] ?? type}</h2>
          <div className="rounded-lg border bg-transparent divide-y divide-border/40 backdrop-blur-lg">
            {entries.map((record) => (
              <div
                key={record.id}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="text-sm flex-1">{record.talent.name}</span>
                <span className="text-sm font-bold font-mono tabular-nums shrink-0" style={{ color: activeColor }}>
                  {record.usage_pct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
