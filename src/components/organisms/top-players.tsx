"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { TopPlayer } from "@/lib/api"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { classColor } from "@/hooks/use-active-color"
import { formatRealm, winRate } from "@/lib/utils"
import { characterUrl } from "@/components/atoms/player-tooltip"

type Region = "all" | "us" | "eu" | "kr"

interface Props {
  playersByRegion: Record<string, TopPlayer[]>
}

const REGIONS: {
  value: Region
  label: string
}[] = [
  {
    value: "all",
    label: "ALL",
  },
  {
    value: "us",
    label: "US",
  },
  {
    value: "eu",
    label: "EU",
  },
  {
    value: "kr",
    label: "KR",
  },
]

export function TopPlayers({ playersByRegion }: Props) {
  const [region, setRegion] = useState<Region>("all")
  const players = (playersByRegion[region] ?? []).slice(0, 10)
  const router = useRouter()

  if ((playersByRegion.all ?? []).length === 0) return null

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-emerald-500 shadow-[0_0_6px] shadow-emerald-500" />
          <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Top Players
          </h2>
          <div className="ml-2 h-px w-16 bg-gradient-to-r from-border to-transparent" />
        </div>
        <div className="flex rounded-lg border border-border/50 bg-card/30">
          {REGIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRegion(r.value)}
              className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${
                region === r.value
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              } ${r.value === "all" ? "rounded-l-lg" : ""} ${r.value === "kr" ? "rounded-r-lg" : ""}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {players.length === 0 ? (
        <div className="rounded-lg border border-border/50 px-3 py-6 text-center text-xs text-muted-foreground">
          No data available
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/50 bg-card/30">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 bg-black/20">
                <th className="w-12 px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Player
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Rating
                </th>
                <th className="hidden px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                  W / L
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Win %
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Region
                </th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, i) => (
                <TopPlayerRow
                  key={`${player.region}-${player.name}-${player.realm}`}
                  player={player}
                  rank={i + 1}
                  onClick={() => router.push(characterUrl(player))}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function TopPlayerRow({
  player,
  rank,
  onClick,
}: {
  player: TopPlayer
  rank: number
  onClick: () => void
}) {
  const color = classColor(player.class_slug as WowClassSlug)
  const isTop3 = rank <= 3
  const rankColor =
    rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : undefined

  const wr = winRate(player.wins, player.losses)
  const wrNum =
    player.wins + player.losses > 0 ? (player.wins / (player.wins + player.losses)) * 100 : 0

  return (
    <tr
      className={`cursor-pointer border-b border-white/[0.03] transition-colors hover:bg-white/[0.03] ${isTop3 ? "border-l-2" : ""}`}
      style={
        isTop3
          ? {
              borderLeftColor: rankColor,
            }
          : undefined
      }
      onClick={onClick}
    >
      <td className="px-4 py-3 text-center">
        <span
          className="text-sm font-bold tabular-nums"
          style={{
            color: rankColor,
          }}
        >
          {rank}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {player.avatar_url && (
            <Image
              src={player.avatar_url}
              alt=""
              width={32}
              height={32}
              className="shrink-0 rounded-lg"
            />
          )}
          <div className="min-w-0">
            <div
              className="truncate text-sm font-semibold"
              style={{
                color,
              }}
            >
              {player.name}
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              {formatRealm(player.realm)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <span
          className={`tabular-nums ${isTop3 ? "text-base font-bold text-amber-300" : "text-sm font-semibold"}`}
        >
          {player.rating.toLocaleString()}
        </span>
      </td>
      <td className="hidden px-4 py-3 text-center text-xs tabular-nums text-muted-foreground sm:table-cell">
        {player.wins} / {player.losses}
      </td>
      <td className="px-4 py-3 text-center">
        <span
          className="text-xs font-semibold tabular-nums"
          style={{
            color: wrNum >= 60 ? "var(--color-stat-versatility)" : undefined,
          }}
        >
          {wr}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center justify-center rounded-md border border-border/50 bg-muted/30 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground">
          {player.region.toUpperCase()}
        </span>
      </td>
    </tr>
  )
}
