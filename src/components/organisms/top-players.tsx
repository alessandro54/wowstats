"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { TopPlayer } from "@/lib/api"
import { classColor } from "@/hooks/use-active-color"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import Image from "next/image"
import { ClickableTooltip } from "@/components/atoms/clickable-tooltip"
import { SlidingSwitch } from "@/components/atoms/sliding-switch"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { formatRealm, titleizeSlug, winRate } from "@/lib/utils"


type Region = "all" | "us" | "eu"

interface Props {
  playersByRegion: Record<Region, TopPlayer[]>
}

function characterUrl(player: TopPlayer): string {
  const realm = player.realm.toLowerCase().replace(/\s+/g, "-")
  return `/character/${player.region.toLowerCase()}/${realm}/${player.name.toLowerCase()}`
}

function PlayerTooltip({ player }: { player: TopPlayer }) {
  const url = characterUrl(player)
  return (
    <div className="w-[220px] space-y-3 text-xs">
      <div>
        <div className="font-semibold text-foreground">{player.name}</div>
        <div className="text-muted-foreground">
          {formatRealm(player.realm)}
          {" · "}
          {player.region.toUpperCase()}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-muted-foreground">
        <div>
          <div className="uppercase tracking-wide text-muted-foreground/70">Class</div>
          <div className="mt-0.5 text-foreground">{titleizeSlug(player.class_slug)}</div>
        </div>
        <div>
          <div className="uppercase tracking-wide text-muted-foreground/70">Rank</div>
          <div className="mt-0.5 text-foreground">{player.rank ?? "—"}</div>
        </div>
        <div>
          <div className="uppercase tracking-wide text-muted-foreground/70">Rating</div>
          <div className="mt-0.5 text-foreground">{player.rating}</div>
        </div>
        <div>
          <div className="uppercase tracking-wide text-muted-foreground/70">W/L</div>
          <div className="mt-0.5 text-foreground">{player.wins}/{player.losses}</div>
        </div>
        <div>
          <div className="uppercase tracking-wide text-muted-foreground/70">Win%</div>
          <div className="mt-0.5 text-foreground">{winRate(player.wins, player.losses)}</div>
        </div>
      </div>
      <Link href={url} className="block">
        <Button size="sm" variant="outline" className="w-full text-xs cursor-pointer md:hidden">
          Go to character page
        </Button>
      </Link>
    </div>
  )
}

function PlayerRow({ player, index }: { player: TopPlayer, index: number }) {
  const router = useRouter()
  const color = classColor(player.class_slug as WowClassSlug)
  const url = characterUrl(player)

  return (
    <ClickableTooltip
      side="bottom"
      align="start"
      content={<PlayerTooltip player={player} />}
    >
      <article
        className="rounded-md border border-border bg-card/80 px-3 py-2 transition-colors hover:bg-muted/20 cursor-pointer"
        onClick={(e) => {
          // On large desktops navigate directly; on smaller screens let the
          // tooltip toggle (Radix fires its own onClick after this unless we
          // call e.preventDefault()).
          if (window.innerWidth >= 1024) {
            e.preventDefault()
            router.push(url)
          }
        }}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_76px_72px_58px] sm:grid-cols-[minmax(0,1fr)_76px_72px_58px_44px] items-center gap-x-3 gap-y-1">
          <div className="flex min-w-0 items-center gap-2.5 rounded-sm text-left">
            <span className="text-[11px] font-mono text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            {player.avatar_url && (
              <Image
                src={player.avatar_url}
                alt=""
                width={28}
                height={28}
                className="shrink-0 rounded"
              />
            )}
            <div className="min-w-0">
              <div className="truncate text-sm font-medium leading-none" style={{ color }}>
                {player.name}
              </div>
              <div className="truncate text-[11px] leading-none text-muted-foreground">
                {formatRealm(player.realm)}
              </div>
            </div>
          </div>
          <div className="text-right text-[11px] tabular-nums text-muted-foreground">
            <div className="uppercase tracking-wide text-muted-foreground/80">Rating</div>
            <span className="text-sm font-semibold text-foreground">{player.rating}</span>
          </div>
          <div className="text-right text-[11px] tabular-nums text-muted-foreground">
            <div className="uppercase tracking-wide text-muted-foreground/80">W/L</div>
            <span>{player.wins}/{player.losses}</span>
          </div>
          <div className="text-right text-[11px] tabular-nums text-muted-foreground hidden sm:block">
            <div className="uppercase tracking-wide text-muted-foreground/80">Win%</div>
            <span>{winRate(player.wins, player.losses)}</span>
          </div>
          <span className="inline-flex w-fit items-center justify-self-end whitespace-nowrap rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">
            {player.region.toUpperCase()}
          </span>
        </div>
      </article>
    </ClickableTooltip>
  )
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
