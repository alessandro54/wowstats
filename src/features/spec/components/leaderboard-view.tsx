"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { characterUrl } from "@/components/atoms/player-tooltip"
import { BRACKETS } from "@/config/wow/brackets-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import { LeaderboardFiltersBar } from "@/features/spec/components/leaderboard/filters-bar"
import {
  LeaderboardPagination,
  LeaderboardRow,
  LeaderboardTh,
} from "@/features/spec/components/leaderboard/row"
import type { LeaderboardResponse } from "@/lib/api"

interface Props {
  bracket: string
  data: LeaderboardResponse
}

const REGIONS = [
  {
    value: "all",
    label: "ALL",
  },
  {
    value: "us",
    label: "US",
  },
  {
    value: "eu",
    label: "EU",
  },
  {
    value: "kr",
    label: "KR",
  },
] as const

const PAGE_SIZES = [
  10,
  25,
  50,
  100,
] as const

export function LeaderboardView({ bracket, data }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentRegion = (searchParams.get("region") ?? "all") as (typeof REGIONS)[number]["value"]

  const [search, setSearch] = useState(searchParams.get("q") ?? "")
  const [classSlug, setClassSlug] = useState<string>(searchParams.get("class") ?? "")
  const [specName, setSpecName] = useState<string>(searchParams.get("spec") ?? "")
  const [minRating, setMinRating] = useState(searchParams.get("min_rating") ?? "")
  const [maxRating, setMaxRating] = useState(searchParams.get("max_rating") ?? "")
  const [minWr, setMinWr] = useState(() => {
    const wr = searchParams.get("min_winrate")
    return wr ? String(Math.round(Number(wr) * 100)) : ""
  })
  const [perPage, setPerPage] = useState<number>(() => {
    const pp = Number(searchParams.get("per_page") ?? 10)
    return PAGE_SIZES.includes(pp as (typeof PAGE_SIZES)[number]) ? pp : 10
  })
  const [page, setPage] = useState(1)

  const classConfig = classSlug ? (WOW_CLASSES.find((c) => c.slug === classSlug) ?? null) : null
  const dbClassSlug = classSlug ? classSlug.replace(/-/g, "_") : ""

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const minR = minRating ? Number(minRating) : null
    const maxR = maxRating ? Number(maxRating) : null
    const minWrac = minWr ? Number(minWr) / 100 : null
    const specId =
      classConfig && specName
        ? (classConfig.specs.find((s) => s.name === specName)?.id ?? null)
        : null

    return data.players.filter((p) => {
      if (q && !p.name.toLowerCase().startsWith(q)) return false
      if (classSlug) {
        const playerClass = (p.class_slug ?? "").replace(/-/g, "_")
        if (playerClass !== dbClassSlug) return false
      }
      if (specId != null && p.spec_id !== specId) return false
      if (minR != null && p.rating < minR) return false
      if (maxR != null && p.rating > maxR) return false
      if (minWrac != null) {
        const games = p.wins + p.losses
        if (games <= 0) return false
        if (p.wins / games < minWrac) return false
      }
      return true
    })
  }, [
    data.players,
    search,
    classSlug,
    dbClassSlug,
    classConfig,
    specName,
    minRating,
    maxRating,
    minWr,
  ])

  useEffect(() => {
    setPage(1)
  }, [
    search,
    classSlug,
    specName,
    minRating,
    maxRating,
    minWr,
    perPage,
  ])

  useEffect(() => {
    if (typeof window === "undefined") return
    const next = new URLSearchParams(window.location.search)
    setOrDelete(next, "q", search)
    setOrDelete(next, "class", classSlug)
    setOrDelete(next, "spec", specName)
    setOrDelete(next, "min_rating", minRating)
    setOrDelete(next, "max_rating", maxRating)
    setOrDelete(next, "min_winrate", minWr ? (Number(minWr) / 100).toString() : "")
    setOrDelete(next, "per_page", perPage === 10 ? "" : String(perPage))
    const qs = next.toString()
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    window.history.replaceState(null, "", url)
  }, [
    search,
    classSlug,
    specName,
    minRating,
    maxRating,
    minWr,
    perPage,
  ])

  useEffect(() => {
    const idle = (cb: () => void) => {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void) => number
      }
      if (w.requestIdleCallback) w.requestIdleCallback(cb)
      else setTimeout(cb, 200)
    }
    idle(() => {
      for (const b of BRACKETS) {
        if (b.slug !== bracket) router.prefetch(bracketHref(b.slug, currentRegion))
      }
    })
  }, [
    bracket,
    currentRegion,
    router,
  ])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * perPage, safePage * perPage)

  const setRegion = (r: string) => {
    const next = new URLSearchParams(searchParams.toString())
    if (r === "all") next.delete("region")
    else next.set("region", r)
    const qs = next.toString()
    router.push(qs ? `?${qs}` : "?")
  }

  const resetFilters = () => {
    setSearch("")
    setClassSlug("")
    setSpecName("")
    setMinRating("")
    setMaxRating("")
    setMinWr("")
    setPerPage(10)
  }

  const hasFilters = !!classSlug || !!specName || !!search || !!minRating || !!maxRating || !!minWr

  return (
    <section className="mx-auto w-full max-w-5xl space-y-4 px-4 py-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Leaderboard
          </p>
          <h1 className="text-2xl font-bold">{bracketLabel(bracket)}</h1>
          <p className="text-xs text-muted-foreground">
            {filtered.length.toLocaleString()} of {data.players.length.toLocaleString()} loaded ·
            page {safePage} of {totalPages}
          </p>
        </div>

        <div className="flex rounded-lg border border-border/50 bg-card/30 p-1">
          {BRACKETS.map((b) => {
            const href = bracketHref(b.slug, currentRegion)
            return (
              <button
                key={b.slug}
                type="button"
                onMouseEnter={() => router.prefetch(href)}
                onFocus={() => router.prefetch(href)}
                onClick={() => router.push(href)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  b.slug === bracket
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {b.label}
              </button>
            )
          })}
        </div>
      </header>

      <LeaderboardFiltersBar
        search={search}
        setSearch={setSearch}
        classSlug={classSlug}
        setClassSlug={setClassSlug}
        setSpecName={setSpecName}
        classConfig={classConfig}
        specName={specName}
        minRating={minRating}
        setMinRating={setMinRating}
        maxRating={maxRating}
        setMaxRating={setMaxRating}
        minWr={minWr}
        setMinWr={setMinWr}
        perPage={perPage}
        setPerPage={setPerPage}
        regions={REGIONS}
        currentRegion={currentRegion}
        setRegion={setRegion}
        prefetchRegion={(r) => router.prefetch(bracketHref(bracket, r))}
        hasFilters={hasFilters}
        resetFilters={resetFilters}
      />

      {pageRows.length === 0 ? (
        <div className="rounded-lg border border-border/50 px-3 py-12 text-center text-sm text-muted-foreground">
          No players found
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/50 bg-card/30">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 bg-black/20">
                <LeaderboardTh className="w-12 text-center">#</LeaderboardTh>
                <LeaderboardTh>Player</LeaderboardTh>
                <LeaderboardTh className="text-center">Rating</LeaderboardTh>
                <LeaderboardTh className="hidden text-center sm:table-cell">W / L</LeaderboardTh>
                <LeaderboardTh className="text-center">Win %</LeaderboardTh>
                <LeaderboardTh className="text-center">Region</LeaderboardTh>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((player, i) => (
                <LeaderboardRow
                  key={`${player.region}-${player.name}-${player.realm}-${player.spec_id ?? "x"}-${player.rank ?? i}`}
                  player={player}
                  onClick={() => router.push(characterUrl(player))}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <LeaderboardPagination page={safePage} totalPages={totalPages} onChange={setPage} />
    </section>
  )
}

function bracketLabel(slug: string): string {
  return BRACKETS.find((b) => b.slug === slug)?.label ?? slug
}

function bracketHref(bracket: string, region: string): string {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  if (region && region !== "all") params.set("region", region)
  else params.delete("region")
  const qs = params.toString()
  return `/pvp/leaderboard/${bracket}${qs ? `?${qs}` : ""}`
}

function setOrDelete(params: URLSearchParams, key: string, value: string) {
  if (value) params.set(key, value)
  else params.delete(key)
}
