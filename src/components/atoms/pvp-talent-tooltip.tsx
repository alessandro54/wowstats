import type { MetaTalent } from "@/lib/api"
import Image from "next/image"

interface Props {
  talent: MetaTalent
  activeColor: string
}

export function PvpTalentTooltip({ talent, activeColor }: Props) {
  return (
    <div className="min-w-36 space-y-1.5">
      <div className="flex items-center gap-2">
        {talent.talent.icon_url && (
          <Image
            src={talent.talent.icon_url}
            width={50}
            height={50}
            className="shrink-0 rounded-full"
            alt={talent.talent.name}
            unoptimized
          />
        )}
        <span className="text-xs font-semibold leading-tight">{talent.talent.name}</span>
      </div>
      {talent.talent.description && (
        <p className="text-muted-foreground max-w-52 text-[11px] leading-snug">
          {talent.talent.description}
        </p>
      )}
      <p className="font-mono text-[11px] font-bold" style={{ color: activeColor }}>
        {talent.usage_pct.toFixed(1)}%
      </p>
    </div>
  )
}
