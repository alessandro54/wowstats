"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useSetHoverSlug } from "@/components/providers/hover-provider"
import { BRACKETS } from "@/config/wow/brackets-config"
import type { WowClassConfig, WowClassSlug } from "@/config/wow/classes/classes-config"
import { cn } from "@/lib/utils"

interface Props {
  classes: WowClassConfig[]
}

function cssColor(slug: string) {
  return `var(--color-class-${slug})`
}

const RADIUS_PCT = 38 // radius as % of the square container

export function ClassOrbital({ classes }: Props) {
  const [active, setActive] = useState<WowClassSlug | null>(null)
  const [activeSpec, setActiveSpec] = useState<number | null>(null)
  const setHoverSlug = useSetHoverSlug()
  const N = classes.length

  const activeCls = classes.find((c) => c.slug === active) ?? null
  const spinning = !active

  function handleClassClick(slug: WowClassSlug) {
    const next = active === slug ? null : slug
    setActive(next)
    setHoverSlug(next)
    setActiveSpec(null)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Orbital ring */}
      <div className="mx-auto w-full max-w-[300px]">
        <div
          className="relative w-full"
          style={{
            paddingBottom: "100%",
          }}
        >
          <div className="absolute inset-0">
            {/* Decorative rings */}
            <div className="absolute inset-[11%] rounded-full border border-white/8" />
            <div
              className="absolute inset-[11%] rounded-full border border-white/5 transition-opacity duration-500"
              style={{
                boxShadow: activeCls
                  ? `0 0 30px 2px color-mix(in srgb, ${cssColor(activeCls.slug)} 20%, transparent) inset`
                  : undefined,
              }}
            />

            {/* Spinning container — all icons rotate together */}
            <div
              className="absolute inset-0"
              style={{
                animation: "orbit-spin 50s linear infinite",
                animationPlayState: spinning ? "running" : "paused",
              }}
            >
              {classes.map((cls, i) => {
                const angle = ((2 * Math.PI) / N) * i - Math.PI / 2
                const x = 50 + RADIUS_PCT * Math.cos(angle)
                const y = 50 + RADIUS_PCT * Math.sin(angle)
                const isActive = active === cls.slug

                return (
                  <button
                    key={cls.slug}
                    type="button"
                    onClick={() => handleClassClick(cls.slug as WowClassSlug)}
                    onMouseEnter={() => setHoverSlug(cls.slug as WowClassSlug)}
                    onMouseLeave={() => setHoverSlug(active)}
                    className="absolute transition-all duration-400"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) scale(${isActive ? 1.4 : 1})`,
                      opacity: active && !isActive ? 0.25 : 1,
                      zIndex: isActive ? 10 : 1,
                      transitionDuration: "350ms",
                    }}
                  >
                    {/* Counter-rotate so the icon stays upright while ring spins */}
                    <div
                      className="relative size-10 rounded-xl"
                      style={{
                        animation: "orbit-counter 50s linear infinite",
                        animationPlayState: spinning ? "running" : "paused",
                        boxShadow: isActive
                          ? `0 0 0 2px ${cssColor(cls.slug)}, 0 0 18px 2px color-mix(in srgb, ${cssColor(cls.slug)} 60%, transparent)`
                          : undefined,
                      }}
                    >
                      <Image
                        src={cls.iconRemasteredUrl || cls.iconUrl}
                        alt={cls.name}
                        fill
                        className="rounded-xl object-contain"
                      />
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Center display */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              {activeCls ? (
                <div className="animate-fade-in pointer-events-auto flex flex-col items-center gap-1.5">
                  <Image
                    src={activeCls.iconRemasteredUrl || activeCls.iconUrl}
                    alt={activeCls.name}
                    width={52}
                    height={52}
                    className="rounded-xl"
                    style={{
                      boxShadow: `0 0 24px 4px color-mix(in srgb, ${cssColor(activeCls.slug)} 50%, transparent)`,
                    }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: cssColor(activeCls.slug),
                    }}
                  >
                    {activeCls.name}
                  </span>
                </div>
              ) : (
                <p className="text-center text-xs leading-relaxed text-muted-foreground/40">
                  tap a<br />
                  class
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spec + bracket panel */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          activeCls ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          {activeCls && (
            <div
              className="animate-fade-in rounded-xl border p-4"
              style={{
                borderColor: `color-mix(in srgb, ${cssColor(activeCls.slug)} 30%, transparent)`,
                background: `color-mix(in srgb, ${cssColor(activeCls.slug)} 5%, transparent)`,
              }}
            >
              <div className="flex flex-col gap-0.5">
                {activeCls.specs.map((spec) => {
                  const isSpecActive = activeSpec === spec.id
                  return (
                    <div key={spec.id}>
                      <button
                        type="button"
                        onClick={() => setActiveSpec(isSpecActive ? null : spec.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
                          isSpecActive ? "bg-white/5" : "text-muted-foreground",
                        )}
                      >
                        <Image
                          src={spec.iconRemasteredUrl || spec.iconUrl}
                          alt={spec.name}
                          width={28}
                          height={28}
                          className="shrink-0 rounded-sm"
                        />
                        <span className="flex-1 text-left text-sm capitalize">{spec.name}</span>
                      </button>

                      <div
                        className={cn(
                          "grid transition-all duration-200 ease-in-out",
                          isSpecActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                        )}
                      >
                        <div className="overflow-hidden">
                          <div className="flex flex-wrap gap-2 pb-2 pl-[52px] pt-1">
                            {BRACKETS.map((bracket, i) => (
                              <Link
                                key={bracket.slug}
                                href={`/pvp/${activeCls.slug}/${spec.name}/${bracket.slug}`}
                                className="animate-pill-in rounded-full px-3 py-1 text-xs font-semibold transition-colors"
                                style={{
                                  border: `1px solid ${cssColor(activeCls.slug)}`,
                                  color: cssColor(activeCls.slug),
                                  animationDelay: `${i * 80}ms`,
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
          )}
        </div>
      </div>
    </div>
  )
}
