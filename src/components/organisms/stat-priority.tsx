import type { StatPriorityEntry } from "@/lib/api"
import { getStatMeta } from "@/config/equipment-config"

interface Props {
  stats: StatPriorityEntry[]
}

export function StatPriority({ stats }: Props) {
  if (stats.length === 0) return null

  const max = stats[0].pct

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Stat Priority</h2>
      <div className="rounded-lg border border-border bg-card/80 px-4 py-3 space-y-2.5">
        <p className="text-[11px] text-muted-foreground">
          Based on crafting stat choices across top players
        </p>
        <div className="space-y-2">
          {stats.map((entry, i) => {
            const { label, color } = getStatMeta(entry.stat)
            const barWidth = max > 0 ? (entry.pct / max) * 100 : 0

            return (
              <div key={entry.stat} className="flex items-center gap-3">
                <span className="w-4 text-right text-[11px] font-mono text-muted-foreground shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-xs font-medium"
                      style={{
                        color,
                      }}
                    >
                      {label}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-muted-foreground shrink-0">
                      {entry.pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
