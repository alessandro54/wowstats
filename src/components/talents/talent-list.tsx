"use client"

import Image from "next/image"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { MetaTalent } from "@/lib/api"

export function TalentList({
  talents,
  activeColor,
}: {
  talents:     MetaTalent[]
  activeColor: string
}) {
  return (
    <div className="rounded-lg border bg-transparent divide-y divide-border/40 backdrop-blur-lg">
      {talents.map((record) => (
        <div
          key={record.id ?? record.talent.id}
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors first:rounded-t-lg last:rounded-b-lg"
        >
          {record.talent.icon_url && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Image
                  src={record.talent.icon_url}
                  alt={record.talent.name}
                  width={24}
                  height={24}
                  className="rounded shrink-0 cursor-default"
                  unoptimized
                />
              </TooltipTrigger>
              <TooltipContent>{record.talent.name}</TooltipContent>
            </Tooltip>
          )}
          <span className="text-sm flex-1">{record.talent.name}</span>
          <span
            className="text-sm font-bold font-mono tabular-nums shrink-0"
            style={{ color: activeColor }}
          >
            {record.usage_pct.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  )
}
