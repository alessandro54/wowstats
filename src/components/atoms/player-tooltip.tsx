import type { TopPlayer } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatRealm, titleizeSlug, winRate } from "@/lib/utils"

export function characterUrl(player: TopPlayer): string {
  const realm = player.realm.toLowerCase().replace(/\s+/g, "-")
  return `/character/${player.region.toLowerCase()}/${realm}/${player.name.toLowerCase()}`
}

export function PlayerTooltip({ player }: { player: TopPlayer }) {
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
          <div className="mt-0.5 text-foreground">
            {player.wins}/{player.losses}
          </div>
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
