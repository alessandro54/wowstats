"use client"

import { ClassDropdown, SpecDropdown } from "@/features/spec/components/leaderboard/dropdowns"
import type { WowClassConfig } from "@/config/wow/classes/classes-config"

const PAGE_SIZES = [
  10,
  25,
  50,
  100,
] as const

export interface RegionOption {
  value: string
  label: string
}

interface Props {
  search: string
  setSearch: (v: string) => void
  classSlug: string
  setClassSlug: (v: string) => void
  setSpecName: (v: string) => void
  classConfig: WowClassConfig | null
  specName: string
  minRating: string
  setMinRating: (v: string) => void
  maxRating: string
  setMaxRating: (v: string) => void
  minWr: string
  setMinWr: (v: string) => void
  perPage: number
  setPerPage: (n: number) => void
  regions: readonly RegionOption[]
  currentRegion: string
  setRegion: (v: string) => void
  prefetchRegion?: (v: string) => void
  hasFilters: boolean
  resetFilters: () => void
}

export function LeaderboardFiltersBar({
  search,
  setSearch,
  classSlug,
  setClassSlug,
  setSpecName,
  classConfig,
  specName,
  minRating,
  setMinRating,
  maxRating,
  setMaxRating,
  minWr,
  setMinWr,
  perPage,
  setPerPage,
  regions,
  currentRegion,
  setRegion,
  prefetchRegion,
  hasFilters,
  resetFilters,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-card/30 p-3">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search character name…"
        className="min-w-[180px] flex-1 rounded-lg border border-border/50 bg-background/40 px-3 py-1.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-border"
      />

      <ClassDropdown
        value={classSlug}
        onChange={(v) => {
          setClassSlug(v ?? "")
          setSpecName("")
        }}
      />
      {classConfig && (
        <SpecDropdown
          classConfig={classConfig}
          value={specName}
          onChange={(v) => setSpecName(v ?? "")}
        />
      )}

      <div className="flex items-center gap-1">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Rating</span>
        <input
          type="number"
          inputMode="numeric"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          placeholder="min"
          className="w-20 rounded-lg border border-border/50 bg-background/40 px-2 py-1.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-border"
        />
        <span className="text-muted-foreground">–</span>
        <input
          type="number"
          inputMode="numeric"
          value={maxRating}
          onChange={(e) => setMaxRating(e.target.value)}
          placeholder="max"
          className="w-20 rounded-lg border border-border/50 bg-background/40 px-2 py-1.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-border"
        />
      </div>

      <div className="flex items-center gap-1">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Min WR</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={minWr}
          onChange={(e) => setMinWr(e.target.value)}
          placeholder="%"
          className="w-16 rounded-lg border border-border/50 bg-background/40 px-2 py-1.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-border"
        />
      </div>

      <div className="flex items-center gap-1">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Show</span>
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="rounded-lg border border-border/50 bg-background/40 px-2 py-1.5 text-xs font-medium hover:bg-white/10"
        >
          {PAGE_SIZES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="flex rounded-lg border border-border/50 bg-background/40">
        {regions.map((r) => (
          <button
            key={r.value}
            type="button"
            onMouseEnter={() => prefetchRegion?.(r.value)}
            onFocus={() => prefetchRegion?.(r.value)}
            onClick={() => setRegion(r.value)}
            className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${
              currentRegion === r.value
                ? "bg-white/10"
                : "text-muted-foreground hover:text-foreground"
            } ${r.value === "all" ? "rounded-l-lg" : ""} ${r.value === "kr" ? "rounded-r-lg" : ""}`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="rounded-lg border border-border/50 bg-background/40 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground"
        >
          Reset
        </button>
      )}
    </div>
  )
}
