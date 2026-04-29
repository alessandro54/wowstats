"use client"

import Image from "next/image"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { MetaTalent } from "@/lib/api"
import { iconUrl } from "@/config/cdn-config"

export function TalentList({
  talents,
  activeColor,
  hideStats,
}: {
  talents: MetaTalent[]
  activeColor: string
  hideStats?: boolean
}) {
  return (
    <div className="divide-border/40 divide-y rounded-lg border bg-transparent backdrop-blur-lg">
      {talents.map((record) => (
        <div
          key={record.id ?? record.talent.id}
          className="hover:bg-muted/20 flex items-center gap-3 px-4 py-2.5 transition-colors first:rounded-t-lg last:rounded-b-lg"
        >
          {record.talent.icon_url && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Image
                  src={iconUrl(record.talent.icon_url, 24)!}
                  alt={record.talent.name}
                  width={24}
                  height={24}
                  className="shrink-0 cursor-default rounded"
                  unoptimized
                />
              </TooltipTrigger>
              <TooltipContent>{record.talent.name}</TooltipContent>
            </Tooltip>
          )}
          <span className="flex-1 text-sm">{record.talent.name}</span>
          {!hideStats && (
            <span
              className="shrink-0 font-mono text-sm font-bold tabular-nums"
              style={{
                color: activeColor,
              }}
            >
              {record.usage_pct.toFixed(1)}%
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
