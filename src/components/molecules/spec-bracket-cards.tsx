"use client"

import { ChevronRight } from "lucide-react"
import { TransitionLink as Link } from "@/components/atoms/transition-link"
import type { BracketData } from "@/app/pvp/[classSlug]/[specSlug]/page"
import { TIER_COLORS } from "@/config/app-config"

interface Props {
  brackets: BracketData[]
  classSlug: string
}

export function SpecBracketCards({ brackets, classSlug }: Props) {
  const classColor = `var(--color-class-${classSlug})`

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {brackets.map((b) => (
        <Link
          key={b.slug}
          href={b.href}
          className="group relative rounded-xl border border-border/50 bg-card/30 px-5 pb-5 pt-4 transition-all hover:scale-[1.02] hover:border-border hover:bg-card/60"
        >
          {/* Top accent line */}
          <div
            className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl opacity-40 transition-opacity group-hover:opacity-80"
            style={{
              background: classColor,
            }}
          />

          {/* Header: name + tier */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p
                className="text-lg font-bold"
                style={{
                  color: classColor,
                }}
              >
                {b.label}
              </p>
              <p className="text-[11px] text-muted-foreground">{b.description}</p>
            </div>
            {b.tier ? (
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${TIER_COLORS[b.tier]}`}
              >
                {b.tier}
              </span>
            ) : (
              <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
            )}
          </div>

          {/* Stats */}
          {b.wrHat !== null && (
            <div className="mt-4 space-y-3">
              {/* Win Rate */}
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Win Rate
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: b.wrHat > 0.5 ? "var(--color-stat-versatility)" : undefined,
                    }}
                  >
                    {(b.wrHat * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-1.5 h-[3px] rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(b.wrHat * 100, 100)}%`,
                      background: classColor,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>

              {/* Presence */}
              {b.presence !== null && (
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Presence
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {(b.presence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-[3px] rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(b.presence * 100 * 5, 100)}%`,
                        background: classColor,
                        opacity: 0.35,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Footer: player count + avg rating */}
              <div className="flex items-center justify-between border-t border-border/30 pt-3">
                <span className="text-[10px] text-muted-foreground">
                  <strong className="font-medium text-muted-foreground/80">
                    {b.playerCount.toLocaleString()}
                  </strong>{" "}
                  players
                </span>
                {b.meanRating !== null && (
                  <span className="text-[10px] text-muted-foreground">
                    ~{Math.round(b.meanRating).toLocaleString()} CR
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Arrow on hover */}
          <ChevronRight className="absolute bottom-4 right-4 size-4 text-muted-foreground/0 transition-all group-hover:text-muted-foreground" />
        </Link>
      ))}
    </div>
  )
}
