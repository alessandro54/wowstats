import Image from "next/image"
import { titleizeSlug } from "@/lib/utils"

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
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {/* Stats merged */}
      <div className="rounded-lg border border-border/30 bg-card/20 backdrop-blur-sm dark:bg-black/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">Players</p>
            <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">
              {totalPlayers.toLocaleString()}
            </p>
          </div>
          <div className="w-px self-stretch bg-border/40" />
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
              Avg Rating
            </p>
            <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">
              {weightedAvgRating.toFixed(0)}
            </p>
          </div>
          <div className="w-px self-stretch bg-border/40" />
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
              Avg Win Rate <span className="normal-case opacity-60">adj.</span>
            </p>
            <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">
              {(weightedAvgWinRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Top Spec + Most Reliable merged */}
      <div className="rounded-lg border border-border/30 bg-card/20 backdrop-blur-sm dark:bg-black/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 flex-col items-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">Top Spec</p>
            <div className="mt-0.5 flex items-center gap-2">
              {topSpec.iconUrl && (
                <Image
                  src={topSpec.iconUrl}
                  alt={topSpec.name}
                  width={20}
                  height={20}
                  className="rounded-sm"
                  unoptimized
                />
              )}
              <p
                className="text-base font-bold"
                style={{
                  color: topSpec.color,
                }}
              >
                {titleizeSlug(topSpec.name)}
              </p>
            </div>
          </div>
          <div className="w-px self-stretch bg-border/40" />
          <div className="flex flex-1 flex-col items-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
              Most Reliable
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              {mostReliable.iconUrl && (
                <Image
                  src={mostReliable.iconUrl}
                  alt={mostReliable.name}
                  width={20}
                  height={20}
                  className="rounded-sm"
                  unoptimized
                />
              )}
              <p
                className="text-base font-bold"
                style={{
                  color: mostReliable.color,
                }}
              >
                {titleizeSlug(mostReliable.name)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
