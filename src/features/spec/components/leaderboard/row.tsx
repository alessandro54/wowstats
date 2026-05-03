"use client"

import { LazyImage } from "@/components/atoms/lazy-image"
import { PlayerHoverCard } from "@/components/molecules/player-hover-card"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { classColor } from "@/hooks/use-active-color"
import type { TopPlayer } from "@/lib/api"
import { formatRealm, winRate } from "@/lib/utils"

export function LeaderboardRow({ player, onClick }: { player: TopPlayer; onClick: () => void }) {
  const color = classColor(player.class_slug as WowClassSlug)
  const wr = winRate(player.wins, player.losses)
  const wrNum =
    player.wins + player.losses > 0 ? (player.wins / (player.wins + player.losses)) * 100 : 0

  return (
    <PlayerHoverCard
      player={player}
      onClick={onClick}
      className="cursor-pointer border-b border-white/[0.03] transition-colors hover:bg-white/[0.03]"
    >
      <td className="px-4 py-3 text-center">
        <span className="text-sm font-bold tabular-nums">{player.rank ?? "—"}</span>
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
      <td className="px-4 py-3 text-center text-sm font-semibold tabular-nums">
        {player.rating.toLocaleString()}
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

export function LeaderboardTh({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <th
      className={`px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ${className}`}
    >
      {children}
    </th>
  )
}

export function LeaderboardPagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (p: number) => void
}) {
  if (totalPages <= 1) return null
  const prev = page > 1 ? page - 1 : null
  const next = page < totalPages ? page + 1 : null
  return (
    <nav className="flex items-center justify-between gap-2 pt-2 text-xs">
      <button
        type="button"
        disabled={!prev}
        onClick={() => prev && onChange(prev)}
        className="rounded-lg border border-border/50 bg-card/30 px-3 py-1.5 font-medium hover:bg-white/10 disabled:opacity-40"
      >
        ← Prev
      </button>
      <span className="text-muted-foreground">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        disabled={!next}
        onClick={() => next && onChange(next)}
        className="rounded-lg border border-border/50 bg-card/30 px-3 py-1.5 font-medium hover:bg-white/10 disabled:opacity-40"
      >
        Next →
      </button>
    </nav>
  )
}
