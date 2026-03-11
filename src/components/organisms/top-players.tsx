"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import type { TopPlayer } from "@/lib/api"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SlidingSwitch } from "@/components/atoms/sliding-switch"
import { PlayerRow } from "@/components/molecules/player-row"
import { TooltipProvider } from "@/components/ui/tooltip"

type Region = "all" | "us" | "eu"

interface Props {
  playersByRegion: Record<Region, TopPlayer[]>
}

const REGION_OPTIONS = [
  {
    value: "all" as const,
    label: <span className="block px-3 py-1.5 text-xs font-medium">ALL</span>,
  },
  {
    value: "us" as const,
    label: <span className="block px-3 py-1.5 text-xs font-medium">US</span>,
  },
  {
    value: "eu" as const,
    label: <span className="block px-3 py-1.5 text-xs font-medium">EU</span>,
  },
]

export function TopPlayers({ playersByRegion }: Props) {
  const [region, setRegion] = useState<Region>("all")
  const players = playersByRegion[region]
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    updateArrows()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateArrows, {
      passive: true,
    })
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", updateArrows)
      ro.disconnect()
    }
  }, [
    updateArrows,
    players,
  ])

  function scroll(dir: -1 | 1) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({
      left: dir * el.clientWidth * 0.6,
      behavior: "smooth",
    })
  }

  if (playersByRegion.all.length === 0) return null

  return (
    <TooltipProvider>
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Top Players</h2>
          <SlidingSwitch options={REGION_OPTIONS} value={region} onValueChange={setRegion} />
        </div>
        {players.length === 0 ? (
          <div className="rounded-lg border border-border px-3 py-6 text-center text-xs text-muted-foreground">
            No data available
          </div>
        ) : (
          <div className="relative">
            {canScrollLeft && (
              <>
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background to-transparent" />
                <button
                  type="button"
                  onClick={() => scroll(-1)}
                  className="absolute left-2 top-1/2 z-20 -translate-y-4.75 -translate-x-6.75 lg:translate-x-0 rounded-full border border-border bg-card/95 p-1 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted/60"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </>
            )}
            <div ref={scrollRef} className="flex gap-2.5 overflow-x-auto pb-3">
              {players.map((player, i) => (
                <div
                  key={`${player.region}-${player.name}-${player.realm}`}
                  className="w-96 shrink-0"
                >
                  <PlayerRow player={player} index={i} />
                </div>
              ))}
            </div>
            {canScrollRight && (
              <>
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background to-transparent" />
                <button
                  type="button"
                  onClick={() => scroll(1)}
                  className="absolute right-2 top-1/2 z-20 -translate-y-4.75 translate-x-6.75 lg:translate-x-0 rounded-full border border-border bg-card/95 p-1 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted/60"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        )}
      </section>
    </TooltipProvider>
  )
}
