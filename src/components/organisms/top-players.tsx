"use client"

import { useState } from "react"
import type { TopPlayer } from "@/lib/api"
import { SlidingSwitch } from "@/components/atoms/sliding-switch"
import { PlayerRow } from "@/components/molecules/player-row"
import { TooltipProvider } from "@/components/ui/tooltip"

type Region = "all" | "us" | "eu"

interface Props {
  playersByRegion: Record<Region, TopPlayer[]>
}

const REGION_OPTIONS = [
  { value: "all" as const, label: <span className="px-3 py-1.5 block text-xs font-medium">ALL</span> },
  { value: "us" as const, label: <span className="px-3 py-1.5 block text-xs font-medium">US</span> },
  { value: "eu" as const, label: <span className="px-3 py-1.5 block text-xs font-medium">EU</span> },
]

export function TopPlayers({ playersByRegion }: Props) {
  const [region, setRegion] = useState<Region>("all")
  const players = playersByRegion[region]

  if (playersByRegion.all.length === 0)
    return null

  return (
    <TooltipProvider>
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Top Players</h2>
          <SlidingSwitch
            options={REGION_OPTIONS}
            value={region}
            onValueChange={setRegion}
          />
        </div>
        <div className="overflow-x-auto">
          <div className="grid min-w-[420px] grid-cols-1 gap-2.5 md:min-w-0 md:grid-cols-2">
            {players.length === 0
              ? (
                  <div className="rounded-lg border border-border px-3 py-6 text-center text-xs text-muted-foreground md:col-span-2">
                    No data available
                  </div>
                )
              : players.map((player, i) => (
                  <PlayerRow
                    key={`${player.region}-${player.name}-${player.realm}`}
                    player={player}
                    index={i}
                  />
                ))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  )
}
