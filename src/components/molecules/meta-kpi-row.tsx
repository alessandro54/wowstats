import { titleizeSlug } from "@/lib/utils"
import Image from "next/image"

interface TopSpec {
  name: string
  className: string
  color: string
  iconUrl?: string
}

interface MostReliable {
  name: string
  className: string
  color: string
  iconUrl?: string
  bK: number
}

interface Props {
  totalPlayers: number
  weightedAvgRating: number
  weightedAvgWinRate: number
  topSpec: TopSpec
  mostReliable: MostReliable
}

export function MetaKpiRow({
  totalPlayers,
  weightedAvgRating,
  weightedAvgWinRate,
  topSpec,
  mostReliable,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {/* Players */}
      <div className="rounded-lg border border-border bg-card/80 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">Players</p>
        <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">
          {totalPlayers.toLocaleString()}
        </p>
      </div>

      {/* Avg Rating */}
      <div className="rounded-lg border border-border bg-card/80 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">Avg Rating</p>
        <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">
          {weightedAvgRating.toFixed(0)}
        </p>
      </div>

      {/* Avg Win Rate */}
      <div className="rounded-lg border border-border bg-card/80 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
          Avg Win Rate <span className="normal-case opacity-60">adj.</span>
        </p>
        <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">
          {(weightedAvgWinRate * 100).toFixed(1)}%
        </p>
      </div>

      {/* Top Spec */}
      <div className="rounded-lg border border-border bg-card/80 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">Top Spec</p>
        <div className="mt-0.5 flex items-center gap-2">
          {topSpec.iconUrl && (
            <Image
              src={topSpec.iconUrl}
              alt={topSpec.name}
              width={24}
              height={24}
              className="rounded-sm"
              unoptimized
            />
          )}
          <p
            className="text-xl font-bold tabular-nums"
            style={{
              color: topSpec.color,
            }}
          >
            {titleizeSlug(topSpec.name)}
          </p>
        </div>
      </div>

      {/* Most Reliable */}
      <div className="rounded-lg border border-border bg-card/80 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
          Most Reliable
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          {mostReliable.iconUrl && (
            <Image
              src={mostReliable.iconUrl}
              alt={mostReliable.name}
              width={24}
              height={24}
              className="rounded-sm"
              unoptimized
            />
          )}
          <p
            className="text-xl font-bold tabular-nums"
            style={{
              color: mostReliable.color,
            }}
          >
            {titleizeSlug(mostReliable.name)}
          </p>
        </div>
      </div>
    </div>
  )
}
