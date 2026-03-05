"use client"

import { useState } from "react"
import type { TopPlayer } from "@/lib/api"
import { classColor } from "@/hooks/use-active-color"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import Image from "next/image"

type Region = "all" | "us" | "eu"

interface Props {
  playersByRegion: Record<Region, TopPlayer[]>
}

function winrate(wins: number, losses: number): string {
  const total = wins + losses
  if (total === 0) return "—"
  return `${Math.round((wins / total) * 100)}%`
}

const REGION_LABELS: { value: Region; label: string }[] = [
  { value: "all", label: "US + EU" },
  { value: "us", label: "US" },
  { value: "eu", label: "EU" },
]

export function TopPlayers({ playersByRegion }: Props) {
  const [region, setRegion] = useState<Region>("all")
  const players = playersByRegion[region]

  if (playersByRegion.all.length === 0)
    return null

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Top Players</h2>
        <div className="flex rounded-md border border-border overflow-hidden text-xs font-medium">
          {REGION_LABELS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRegion(value)}
              className={[
                "px-3 py-1.5 transition-colors",
                region === value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <th className="px-3 py-2 w-8">#</th>
              <th className="px-3 py-2">Player</th>
              <th className="px-3 py-2 text-right">Rating</th>
              <th className="px-3 py-2 text-right hidden sm:table-cell">Score</th>
              <th className="px-3 py-2 text-right hidden sm:table-cell">W/L</th>
              <th className="px-3 py-2 text-right hidden sm:table-cell">Win%</th>
              <th className="px-3 py-2 hidden md:table-cell">Hero Talent</th>
              <th className="px-3 py-2 hidden sm:table-cell">Region</th>
            </tr>
          </thead>
          <tbody>
            {players.length === 0
              ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground text-xs">
                      No data available
                    </td>
                  </tr>
                )
              : players.map((player, i) => {
                  const color = classColor(player.class_slug as WowClassSlug)
                  return (
                    <tr
                      key={`${player.region}-${player.name}-${player.realm}`}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-3 py-2 text-muted-foreground font-mono text-xs">{i + 1}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          {player.avatar_url && (
                            <Image
                              src={player.avatar_url}
                              alt=""
                              width={24}
                              height={24}
                              className="rounded-sm shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <span className="font-medium truncate" style={{ color }}>
                              {player.name}
                            </span>
                            <span className="text-muted-foreground ml-1 text-xs">
                              {player.realm}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums">
                        {player.rating}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums hidden sm:table-cell">
                        <span className="text-xs font-medium text-muted-foreground">
                          {player.score.toFixed(0)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-muted-foreground tabular-nums hidden sm:table-cell">
                        {player.wins}/{player.losses}
                      </td>
                      <td className="px-3 py-2 text-right text-muted-foreground tabular-nums hidden sm:table-cell">
                        {winrate(player.wins, player.losses)}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground text-xs hidden md:table-cell">
                        {player.hero_talent_tree_name ?? "—"}
                      </td>
                      <td className="px-3 py-2 hidden sm:table-cell">
                        <span className="uppercase text-xs text-muted-foreground font-mono">
                          {player.region}
                        </span>
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
