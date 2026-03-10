import type { DistEntry } from "@/components/molecules/distribution-tooltip"
import Image from "next/image"
import { QUALITY_COLORS } from "@/config/equipment-config"

export function DistList({ entries }: { entries: DistEntry[] }) {
  return (
    <div className="space-y-1">
      {entries.map((e) => (
        <div key={e.name} className="flex items-center gap-1.5">
          {e.icon_url && (
            <Image
              src={e.icon_url}
              width={14}
              height={14}
              className="shrink-0 rounded opacity-80"
              alt="class icon"
            />
          )}
          <span
            className="flex-1 truncate text-xs"
            style={{
              color: e.quality ? QUALITY_COLORS[e.quality] : undefined,
            }}
          >
            {e.name}
          </span>
          <span className="text-muted-foreground shrink-0 font-mono text-[11px]">
            {e.pct.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  )
}
