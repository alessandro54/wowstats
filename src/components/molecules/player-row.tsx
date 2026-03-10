"use client"

import type { TopPlayer } from "@/lib/api"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ClickableTooltip } from "@/components/atoms/clickable-tooltip"
import { PlayerTooltip, characterUrl } from "@/components/atoms/player-tooltip"
import { classColor } from "@/hooks/use-active-color"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { formatRealm, winRate } from "@/lib/utils"

export function PlayerRow({ player, index }: { player: TopPlayer, index: number }) {
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
