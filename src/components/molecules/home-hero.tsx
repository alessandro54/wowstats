import Image from "next/image"
import Link from "next/link"
import { TIER_COLORS } from "@/config/app-config"
import { titleizeSlug } from "@/lib/utils"

interface HeroSpec {
  specName: string
  className: string
  bracket: string
  wrHat: number
  presence: number
  iconUrl?: string
  color: string
  specUrl: string
  tier: string
}

interface Props {
  seasonId: number
  totalEntries: number
  topSpecs?: HeroSpec[]
}

export function HomeHero({ seasonId, totalEntries, topSpecs }: Props) {
  return (
    <div className="space-y-6 text-center lg:text-left">
      {/* Season badge */}
      <div className="flex justify-center lg:justify-start">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
          <span className="inline-block size-1.5 rounded-full bg-primary shadow-[0_0_6px] shadow-primary" />
          Season {seasonId} &middot; Live Data
        </span>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          <span className="block">WoW</span>
          <span className="block bg-gradient-to-r from-amber-300 via-orange-400 to-amber-600 bg-clip-text text-transparent">
            Stats
          </span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Data-driven PvP & PvE meta from{" "}
          <strong className="text-foreground">{totalEntries.toLocaleString()}</strong> ranked
          players
        </p>
      </div>
    </div>
  )
}

function SpecCard({ spec, rank }: { spec: HeroSpec; rank: number }) {
  const rankColor =
    rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : undefined

  return (
    <Link
      href={spec.specUrl}
      className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/80 p-3 backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-border/70 block"
      style={
        rankColor
          ? {
              borderColor: `${rankColor}35`,
            }
          : undefined
      }
    >
      {/* Class gradient bg */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(-45deg, color-mix(in oklch, ${spec.color} 10%, transparent), transparent 60%)`,
        }}
      />

      <div className="relative flex flex-col items-center gap-1.5 text-center">
        {/* Rank */}
        <span
          className="text-[10px] font-bold tabular-nums"
          style={{
            color: rankColor ?? "var(--color-muted-foreground)",
          }}
        >
          #{rank}
        </span>

        {/* Icon */}
        {spec.iconUrl ? (
          <Image
            src={spec.iconUrl}
            alt={spec.specName}
            width={40}
            height={40}
            className="rounded-xl"
            style={{
              border: `2px solid ${spec.color}`,
            }}
            unoptimized
            priority
          />
        ) : (
          <div
            className="size-10 rounded-xl bg-muted/30"
            style={{
              border: `2px solid ${spec.color}50`,
            }}
          />
        )}

        {/* Name */}
        <div className="w-full min-w-0">
          <p
            className="truncate text-sm font-bold"
            style={{
              color: spec.color,
            }}
          >
            {titleizeSlug(spec.specName)}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {titleizeSlug(spec.className)}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-1">
          <span
            className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${TIER_COLORS[spec.tier as keyof typeof TIER_COLORS] ?? ""}`}
          >
            {spec.tier}
          </span>
          <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">
            {(spec.wrHat * 100).toFixed(1)}% WR
          </span>
        </div>
      </div>
    </Link>
  )
}
