"use client"

import type { MetaTalent } from "@/lib/api"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function TalentList({
  talents,
  activeColor,
}: {
  talents: MetaTalent[]
  activeColor: string
}) {
  return (
    <div className="divide-border/40 divide-y rounded-lg border bg-transparent backdrop-blur-lg">
      {talents.map(record => (
        <div
          key={record.id ?? record.talent.id}
          className="hover:bg-muted/20 flex items-center gap-3 px-4 py-2.5 transition-colors first:rounded-t-lg last:rounded-b-lg"
        >
          {record.talent.icon_url && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Image
                  src={record.talent.icon_url}
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
          <span
            className="shrink-0 font-mono text-sm font-bold tabular-nums"
            style={{ color: activeColor }}
          >
            {record.usage_pct.toFixed(1)}
            %
          </span>
        </div>
      ))}
    </div>
  )
}
