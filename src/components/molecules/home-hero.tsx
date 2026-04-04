import Image from "next/image"
import Link from "next/link"
import { TIER_COLORS } from "@/config/app-config"
import { titleizeSlug } from "@/lib/utils"

interface SPlusSpec {
  specName: string
  className: string
  bracket: string
  wrHat: number
  presence: number
  iconUrl?: string
  color: string
  specUrl: string
}

interface Props {
  seasonId: number
  totalEntries: number
  sPlus?: SPlusSpec
}

export function HomeHero({ seasonId, totalEntries, sPlus }: Props) {
  return (
    <div className="space-y-6 text-center">
      {/* Season badge */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
          <span className="inline-block size-1.5 rounded-full bg-primary shadow-[0_0_6px] shadow-primary" />
          Season {seasonId} &middot; Live Data
        </span>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-4xl font-black tracking-tight lg:text-6xl">
          <span className="block">WoW</span>
          <span className="block bg-gradient-to-r from-amber-300 via-orange-400 to-amber-600 bg-clip-text text-transparent">
            Meta Insights
          </span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Data-driven PvP rankings from{" "}
          <strong className="text-foreground">{totalEntries.toLocaleString()}</strong> ladder
          entries
        </p>
      </div>

      {/* S+ Spotlight */}
      {sPlus && (
        <Link
          href={sPlus.specUrl}
          data-testid="splus-callout"
          className="group relative mx-auto flex max-w-md items-center gap-4 overflow-hidden rounded-xl border border-red-500/20 bg-card/80 px-5 py-4 backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-red-500/40"
        >
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 flex justify-center">
            <span className="rounded-b-lg bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black">
              #1 This Season
            </span>
          </div>

          {/* Icon */}
          {sPlus.iconUrl && (
            <Image
              src={sPlus.iconUrl}
              alt={sPlus.specName}
              width={46}
              height={46}
              className="shrink-0 rounded-xl"
              style={{
                border: `2px solid ${sPlus.color}`,
              }}
              unoptimized
            />
          )}

          {/* Spec info */}
          <div className="text-left">
            <p
              className="text-sm font-bold"
              style={{
                color: sPlus.color,
              }}
            >
              {titleizeSlug(sPlus.specName)}
            </p>
            <p className="text-[11px] text-muted-foreground">{titleizeSlug(sPlus.className)}</p>
            <div className="mt-1.5 flex gap-1.5">
              <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${TIER_COLORS["S+"]}`}>
                S+
              </span>
              <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">
                {(sPlus.wrHat * 100).toFixed(1)}% WR
              </span>
              <span className="rounded border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground">
                {(sPlus.presence * 100).toFixed(1)}% Presence
              </span>
            </div>
          </div>

          {/* Divider + meta */}
          <div className="mx-2 hidden h-10 w-px bg-border/50 sm:block" />
          <div className="hidden gap-4 sm:flex">
            <div className="text-center">
              <p className="text-sm font-bold">#1</p>
              <p className="text-[10px] text-muted-foreground">3v3 Arena</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}
