"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSetHoverSlug } from "@/components/providers/hover-provider"
import type { WowClassConfig, WowClassSlug } from "@/config/wow/classes/classes-config"
import { BRACKETS } from "@/config/wow/brackets-config"
import { cn } from "@/lib/utils"

interface Props {
  classes: WowClassConfig[]
}

function cssColor(slug: string) {
  return `var(--color-class-${slug})`
}

// Arc geometry — all 13 icons spread top-to-bottom on a fixed curved arc
const RADIUS = 270 // arc radius
const CX = -120 // circle center off-screen left; center icon lands at x = 150
const DIAL_H = 560 // total height of the dial
const CY = DIAL_H / 2 // vertical center = 280
const HALF_ARC = 57 // degrees: class 0 at –57°, class 12 at +57°
const DIAL_W = 170 // container width

export function ClassDial({ classes }: Props) {
  const N = classes.length

  const [selectedIdx, setSelectedIdx] = useState(Math.floor(N / 2))
  const [activeSpec, setActiveSpec] = useState<number | null>(null)
  const setHoverSlug = useSetHoverSlug()

  const activeCls = classes[selectedIdx]

  function angleFor(i: number) {
    return -HALF_ARC + (i / (N - 1)) * (HALF_ARC * 2)
  }

  function posFor(i: number) {
    const rad = (angleFor(i) * Math.PI) / 180
    return {
      x: CX + RADIUS * Math.cos(rad),
      y: CY + RADIUS * Math.sin(rad),
    }
  }

  function selectClass(i: number) {
    setSelectedIdx(i)
    setActiveSpec(null)
    setHoverSlug(classes[i].slug as WowClassSlug)
  }

  // Arc SVG guide — from top icon to bottom icon
  const { x: tx, y: ty } = posFor(0)
  const { x: bx, y: by } = posFor(N - 1)
  const arcPath = `M ${tx.toFixed(1)} ${ty.toFixed(1)} A ${RADIUS} ${RADIUS} 0 0 1 ${bx.toFixed(1)} ${by.toFixed(1)}`

  return (
    <div
      className="flex h-full w-full"
      style={{
        minHeight: DIAL_H,
      }}
    >
      {/* ── Arc selector ────────────────────────────────────── */}
      <div
        className="relative shrink-0"
        style={{
          width: DIAL_W,
          height: "100%",
          minHeight: DIAL_H,
        }}
      >
        {/* Arc guide line */}
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={DIAL_W}
          height="100%"
          viewBox={`0 0 ${DIAL_W} ${DIAL_H}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <path d={arcPath} fill="none" stroke="white" strokeOpacity={0.07} strokeWidth={1} />
        </svg>

        {/* Class icons */}
        {classes.map((cls, i) => {
          const { x, y } = posFor(i)
          const isSelected = i === selectedIdx
          const distFromCenter = Math.abs(i - selectedIdx)
          const scale = isSelected ? 1.15 : 1 - distFromCenter * 0.035
          const opacity = isSelected ? 1 : 1 - distFromCenter * 0.07

          return (
            <button
              key={cls.slug}
              type="button"
              className="absolute cursor-pointer touch-none select-none focus:outline-none"
              style={{
                left: x,
                top: y,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity: Math.max(0.35, opacity),
                zIndex: isSelected ? 10 : 1,
                transition: "transform 200ms ease, opacity 200ms ease",
              }}
              onClick={() => selectClass(i)}
            >
              <div
                className={cn("relative rounded-xl", isSelected ? "size-10" : "size-9")}
                style={{
                  boxShadow: isSelected
                    ? `0 0 0 2px ${cssColor(cls.slug)}, 0 0 18px color-mix(in srgb, ${cssColor(cls.slug)} 55%, transparent)`
                    : undefined,
                  transition: "box-shadow 200ms ease",
                }}
              >
                <Image
                  src={cls.iconRemasteredUrl || cls.iconUrl}
                  alt={cls.name}
                  fill
                  className="rounded-xl object-contain"
                  draggable={false}
                />
              </div>
            </button>
          )
        })}

        {/* Selection marker */}
        <div
          className="pointer-events-none absolute right-0 top-1/2 h-14 w-px -translate-y-1/2 rounded-full"
          style={{
            background: `linear-gradient(to bottom, transparent, ${cssColor(activeCls.slug)}, transparent)`,
            transition: "background 300ms ease",
          }}
        />
      </div>

      {/* ── Specs panel ─────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col justify-center pl-4 pr-3">
        <div key={activeCls.slug} className="animate-fade-in flex flex-col gap-0.5">
          <p
            className="mb-3 text-[10px] font-bold uppercase tracking-widest"
            style={{
              color: cssColor(activeCls.slug),
            }}
          >
            {activeCls.name}
          </p>

          {activeCls.specs.map((spec) => {
            const isSpecActive = activeSpec === spec.id
            return (
              <div key={spec.id}>
                <button
                  type="button"
                  onClick={() => setActiveSpec(isSpecActive ? null : spec.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-150",
                    isSpecActive ? "bg-white/5" : "text-muted-foreground",
                  )}
                >
                  <Image
                    src={spec.iconRemasteredUrl || spec.iconUrl}
                    alt={spec.name}
                    width={26}
                    height={26}
                    className="shrink-0 rounded-sm"
                  />
                  <span className="text-sm capitalize">{spec.name}</span>
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-200",
                    isSpecActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-wrap gap-1.5 pb-2 pl-10 pt-1">
                      {BRACKETS.map((bracket, bi) => (
                        <Link
                          key={bracket.slug}
                          href={`/pvp/${activeCls.slug}/${spec.name}/${bracket.slug}`}
                          className="animate-pill-in rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                          style={{
                            border: `1px solid ${cssColor(activeCls.slug)}`,
                            color: cssColor(activeCls.slug),
                            animationDelay: `${bi * 60}ms`,
                          }}
                        >
                          {bracket.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
