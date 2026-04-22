import Image from "next/image"
import type { DistEntry } from "@/components/molecules/distribution-tooltip"
import { QUALITY_COLORS } from "@/config/equipment-config"
import { TrendArrow } from "@/components/atoms/trend-arrow"

export function DistList({ entries }: { entries: DistEntry[] }) {
  return (
    <div className="space-y-1">
      {entries.map((e, i) => (
        <div key={`${e.name}-${i}`} className="flex items-center gap-1.5">
          {e.icon_url && (
            <Image
              src={e.icon_url}
              width={20}
              height={20}
              className="shrink-0 rounded opacity-90"
              alt="class icon"
            />
          )}
          {e.statDots && e.statDots.length > 0 && (
            <span className="flex shrink-0 gap-0.5">
              {e.statDots.map((color, di) => (
                <span
                  key={di}
                  className="inline-block size-2 rounded-full"
                  style={{
                    background: color,
                  }}
                />
              ))}
            </span>
          )}
          <span
            className="flex-1 truncate text-sm"
            style={{
              color: e.quality ? QUALITY_COLORS[e.quality] : undefined,
            }}
          >
            {e.name}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <span className="text-muted-foreground font-mono text-xs">{e.pct.toFixed(1)}%</span>
            <TrendArrow trend={e.trend} />
          </span>
        </div>
      ))}
    </div>
  )
}
