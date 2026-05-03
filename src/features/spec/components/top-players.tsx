"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LazyImage } from "@/components/atoms/lazy-image"
import { characterUrl } from "@/components/atoms/player-tooltip"
import { PlayerHoverCard } from "@/components/molecules/player-hover-card"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { classColor } from "@/hooks/use-active-color"
import type { TopPlayer } from "@/lib/api"
import { formatRealm, winRate } from "@/lib/utils"

type Region = "all" | "us" | "eu" | "kr"

interface Props {
  playersByRegion: Record<string, TopPlayer[]>
  /** If provided, fetches US/EU data lazily after mount */
  lazyRegionsUrl?: string
  /** Class slug for color fallback when nothing is hovered */
  defaultClassSlug?: WowClassSlug
  /** When set, renders a "Full leaderboard" link in the header. */
  leaderboardHref?: string
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

export function TopPlayers({
  playersByRegion,
  lazyRegionsUrl,
  defaultClassSlug,
  leaderboardHref,
}: Props) {
  const [region, setRegion] = useState<Region>("all")
  const [lazyData, setLazyData] = useState<Record<string, TopPlayer[]>>({})
  const router = useRouter()
  const activeColor = defaultClassSlug
    ? `var(--color-class-${defaultClassSlug})`
    : "var(--color-primary)"

  // Fetch US/EU data in background after mount
  useEffect(() => {
    if (!lazyRegionsUrl) return
    const controller = new AbortController()

    async function fetchRegion(r: string) {
      try {
        const res = await fetch(`${lazyRegionsUrl}&region=${r}`, {
          signal: controller.signal,
        })
        if (!res.ok) return
        const data = await res.json()
        setLazyData((prev) => ({
          ...prev,
          [r]: data.players ?? [],
        }))
      } catch {
        // Silently fail — user sees "No data" for that region
      }
    }

    fetchRegion("us")
    fetchRegion("eu")

    return () => controller.abort()
  }, [
    lazyRegionsUrl,
  ])

  const merged = {
    ...playersByRegion,
    ...lazyData,
  }
  const players = (merged[region] ?? []).slice(0, 10)

  if ((playersByRegion.all ?? []).length === 0) return null

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-emerald-500 shadow-[0_0_6px] shadow-emerald-500" />
          <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Top Players
          </h2>
          <div className="ml-2 hidden h-px w-16 bg-gradient-to-r from-border to-transparent sm:block" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {leaderboardHref && (
            <button
              type="button"
              onMouseEnter={() => router.prefetch(leaderboardHref)}
              onClick={() => router.push(leaderboardHref)}
              className="shrink-0 whitespace-nowrap rounded-lg border border-border/50 bg-card/30 px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-white/10"
              style={{
                color: activeColor,
              }}
            >
              Full leaderboard →
            </button>
          )}
          <div className="flex rounded-lg border border-border/50 bg-card/30">
            {REGIONS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRegion(r.value)}
                className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  region === r.value ? "bg-white/10" : "text-muted-foreground hover:text-foreground"
                } ${r.value === "all" ? "rounded-l-lg" : ""} ${r.value === "kr" ? "rounded-r-lg" : ""}`}
                style={
                  region === r.value
                    ? {
                        color: activeColor,
                      }
                    : undefined
                }
              >
                {r.label}
              </button>
            ))}
          </div>
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
    <PlayerHoverCard
      player={player}
      onClick={onClick}
      className={`cursor-pointer border-b border-white/[0.03] transition-colors hover:bg-white/[0.03] ${isTop3 ? "border-l-2" : ""}`}
      style={
        isTop3
          ? {
              borderLeftColor: rankColor,
            }
          : undefined
      }
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
            <LazyImage
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
    </PlayerHoverCard>
  )
}
