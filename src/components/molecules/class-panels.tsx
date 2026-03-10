"use client"

import { useRef, useState } from "react"
import { preload } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { useSetHoverSlug } from "@/components/providers/hover-provider"
import type { WowClassConfig, WowClassSlug } from "@/config/wow/classes/classes-config"
import { BRACKETS } from "@/config/wow/brackets-config"
import { cn } from "@/lib/utils"

interface Props {
  classes: WowClassConfig[]
}

const MAGNIFY_FLEX = [
  12,
  2.5,
  1.6,
  1.1,
  0.7,
  0.4,
]

function flexForDistance(distance: number): number {
  return MAGNIFY_FLEX[Math.min(distance, MAGNIFY_FLEX.length - 1)]
}

function cssColor(slug: string): string {
  return `var(--color-class-${slug})`
}

export function ClassPanels({ classes }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const [hovered, setHovered] = useState<WowClassSlug | null>(null)
  const [hoveredSpec, setHoveredSpec] = useState<number | null>(null)
  const [activeSpec, setActiveSpec] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const setHoverSlug = useSetHoverSlug()
  const activeIndex = active ? classes.findIndex((c) => c.slug === active) : -1
  const activeClass = activeIndex >= 0 ? classes[activeIndex] : null
  const sliderRef = useRef<HTMLDivElement>(null)
  const N = classes.length

  function selectIndex(idx: number) {
    const slug = classes[idx].slug as WowClassSlug
    setActive(slug)
    setHoverSlug(slug)
    setActiveSpec(null)
  }

  function handleMouseEnter(slug: WowClassSlug) {
    setHovered(slug)
    if (!active) setHoverSlug(slug)
  }

  function handleMouseLeave() {
    setHovered(null)
    if (!active) setHoverSlug(null)
  }

  function handlePanelClick(slug: WowClassSlug, e: React.MouseEvent) {
    if (active === slug) return
    e.preventDefault()
    setActive(slug)
    setHoverSlug(slug)
    setActiveSpec(null)
  }

  function indexFromPointer(clientX: number): number {
    const rect = sliderRef.current?.getBoundingClientRect()
    if (!rect) return 0
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.min(Math.round(x * (N - 1)), N - 1)
  }

  function handleSliderPointerDown(e: React.PointerEvent) {
    setIsDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    selectIndex(indexFromPointer(e.clientX))
  }

  function handleSliderPointerMove(e: React.PointerEvent) {
    if (!isDragging) return
    selectIndex(indexFromPointer(e.clientX))
  }

  function handleSliderPointerUp() {
    setIsDragging(false)
  }

  const thumbPercent = activeIndex >= 0 ? (activeIndex / (N - 1)) * 100 : null

  // Preload all class banners and spec splashes so they're cached on first use
  for (const cls of classes) {
    const banner = cls.bannerUrl || cls.iconRemasteredUrl || cls.iconUrl
    preload(banner, {
      as: "image",
    })
    for (const spec of cls.specs) {
      if (spec.splash?.url)
        preload(spec.splash.url, {
          as: "image",
        })
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Panels */}
      <div
        className="flex min-h-0 flex-1 overflow-x-auto"
        onMouseLeave={() => {
          setHovered(null)
          if (!active) setHoverSlug(null)
        }}
      >
        {classes.map((cls, index) => {
          const isActive = active === cls.slug
          const isHovered = hovered === cls.slug
          const distance = activeIndex >= 0 ? Math.abs(index - activeIndex) : -1
          const flexGrow = activeIndex >= 0 ? flexForDistance(distance) : 1

          return (
            <div
              key={cls.slug}
              onMouseEnter={() => handleMouseEnter(cls.slug as WowClassSlug)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => handlePanelClick(cls.slug as WowClassSlug, e)}
              className={cn(
                "relative flex h-full shrink-0 overflow-hidden bg-transparent transition-all duration-300 ease-in-out",
                isActive ? "cursor-default" : "cursor-pointer",
              )}
              style={
                {
                  "--cls-color": cssColor(cls.slug),
                  flexGrow,
                  flexShrink: 1,
                  flexBasis: 0,
                  backgroundColor:
                    !isActive && isHovered
                      ? `color-mix(in srgb, ${cssColor(cls.slug)} 6%, transparent)`
                      : undefined,
                } as React.CSSProperties
              }
            >
              {/* Collapsed — icon only */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                  isActive ? "opacity-0 pointer-events-none" : "opacity-100",
                )}
                style={{
                  opacity: active && !isActive ? 0.4 : undefined,
                }}
              >
                <div
                  className="relative w-[clamp(28px,70%,60px)] aspect-square animate-icon-in"
                  style={{
                    animationDelay: `${index * 60}ms`,
                  }}
                >
                  <Image
                    src={cls.iconRemasteredUrl || cls.iconUrl}
                    alt={cls.name}
                    fill
                    className="rounded-lg object-contain opacity-60"
                  />
                </div>
              </div>

              {/* Expanded — image placeholder + spec links */}
              <div
                className={cn(
                  "flex h-full w-full transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-0 pointer-events-none",
                )}
              >
                {/* Left: splash or class banner */}
                <div
                  className="relative flex w-3/5 shrink-0 items-center justify-center overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${cssColor(cls.slug)} 20%, transparent), color-mix(in srgb, ${cssColor(cls.slug)} 5%, transparent))`,
                    maskImage:
                      "linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)",
                  }}
                >
                  {/* Base: class banner */}
                  <Image
                    src={cls.bannerUrl || cls.iconRemasteredUrl || cls.iconUrl}
                    alt={cls.name}
                    fill
                    className="object-cover object-right opacity-40 transition-opacity duration-500"
                    style={{
                      opacity: hoveredSpec ? 0 : undefined,
                    }}
                  />
                  {/* Spec splashes — crossfade on hover */}
                  {cls.specs.map(
                    (spec) =>
                      spec.splash?.url && (
                        <Image
                          key={spec.id}
                          src={spec.splash.url}
                          alt={spec.name}
                          fill
                          className="object-cover transition-opacity duration-500"
                          style={{
                            opacity: hoveredSpec === spec.id ? 0.45 : 0,
                            objectPosition: spec.splash.position ?? "right center",
                          }}
                        />
                      ),
                  )}
                </div>

                {/* Right: name + specs */}
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-4 py-3 select-none">
                  <p
                    className="mb-1 text-base font-bold"
                    style={{
                      color: cssColor(cls.slug),
                    }}
                  >
                    {cls.name}
                  </p>
                  {cls.specs.map((spec) => {
                    const isSpecActive = activeSpec === spec.id
                    const showPills = isSpecActive || hoveredSpec === spec.id
                    return (
                      <div
                        key={spec.id}
                        className="flex flex-col gap-1.5"
                        onMouseEnter={() => setHoveredSpec(spec.id)}
                        onMouseLeave={() => setHoveredSpec(null)}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (window.matchMedia("(hover: none)").matches)
                              setActiveSpec(isSpecActive ? null : spec.id)
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200"
                          style={
                            isSpecActive || hoveredSpec === spec.id
                              ? {
                                  backgroundColor: `color-mix(in srgb, ${cssColor(cls.slug)} 15%, transparent)`,
                                }
                              : undefined
                          }
                        >
                          <Image
                            src={spec.iconRemasteredUrl || spec.iconUrl}
                            alt={spec.name}
                            width={40}
                            height={40}
                            className="shrink-0 rounded-full object-contain"
                          />
                          <span className="capitalize text-base text-muted-foreground">
                            {spec.name}
                          </span>
                        </button>

                        <div
                          className={cn(
                            "grid transition-all duration-200 ease-in-out",
                            showPills ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                          )}
                        >
                          <div className="overflow-hidden">
                            <div
                              key={showPills ? spec.id : undefined}
                              className="flex gap-1.5 pb-1 pl-1"
                            >
                              {BRACKETS.map((bracket, i) => (
                                <Link
                                  key={bracket.slug}
                                  href={`/pvp/${cls.slug}/${spec.name}/${bracket.slug}`}
                                  className="animate-pill-in rounded-full px-3 py-1 text-sm font-semibold transition-all"
                                  style={{
                                    border: `1px solid ${cssColor(cls.slug)}`,
                                    color: cssColor(cls.slug),
                                    animationDelay: `${i * 100}ms`,
                                  }}
                                  onMouseEnter={(e) => {
                                    const el = e.currentTarget
                                    el.style.backgroundColor = `color-mix(in srgb, ${cssColor(cls.slug)} 75%, transparent)`
                                    el.style.color = "oklch(10% 0 0)"
                                  }}
                                  onMouseLeave={(e) => {
                                    const el = e.currentTarget
                                    el.style.backgroundColor = "transparent"
                                    el.style.color = cssColor(cls.slug)
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

              {/* Separator */}
              {cls.slug !== classes[classes.length - 1].slug && (
                <div
                  className="pointer-events-none absolute right-0 top-0 h-full w-px bg-linear-to-b from-transparent via-black/10 to-transparent dark:via-white/10"
                  style={{
                    transition: "opacity 400ms ease",
                    opacity: (() => {
                      if (activeIndex < 0) return 1
                      const dist = index + 0.5 - activeIndex
                      const maxD = dist < 0 ? activeIndex - 0.5 : N - 1.5 - activeIndex
                      return maxD > 0 ? 1 - Math.abs(dist) / maxD : 1
                    })(),
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Slider */}
      <div className="px-2 py-3">
        {/* Track */}
        <div
          ref={sliderRef}
          className="relative flex h-5 cursor-pointer items-center"
          onPointerDown={handleSliderPointerDown}
          onPointerMove={handleSliderPointerMove}
          onPointerUp={handleSliderPointerUp}
          onPointerCancel={handleSliderPointerUp}
        >
          {/* Track line */}
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 rounded-full bg-black/15 dark:bg-white/10" />

          {/* Class icon stops */}
          {classes.map((cls, i) => {
            const isStop = activeIndex === i
            return (
              <div
                key={cls.slug}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                style={{
                  left: `${(i / (N - 1)) * 100}%`,
                }}
              >
                <div
                  className={cn(
                    "rounded-full transition-all duration-200",
                    !isStop && "bg-black/20 dark:bg-white/20",
                  )}
                  style={{
                    width: isStop ? 6 : 4,
                    height: isStop ? 6 : 4,
                    backgroundColor: isStop ? cssColor(cls.slug) : undefined,
                    boxShadow: isStop ? `0 0 6px ${cssColor(cls.slug)}` : undefined,
                  }}
                />
              </div>
            )
          })}

          {/* Thumb */}
          {thumbPercent !== null && activeClass && (
            <div
              className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
              style={{
                left: `${thumbPercent}%`,
              }}
            >
              <div
                className="h-3 w-3 rounded-full ring-2 ring-offset-1 ring-offset-background"
                style={
                  {
                    backgroundColor: cssColor(activeClass.slug),
                    "--tw-ring-color": cssColor(activeClass.slug),
                    boxShadow: `0 0 8px ${cssColor(activeClass.slug)}`,
                  } as React.CSSProperties
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
