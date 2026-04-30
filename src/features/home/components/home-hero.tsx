interface Props {
  seasonId: number
  totalEntries: number
}

export function HomeHero({ seasonId, totalEntries }: Props) {
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
