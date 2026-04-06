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

function ClassCard({
  cls,
  isFlipped,
  onFlip,
}: {
  cls: WowClassConfig
  isFlipped: boolean
  onFlip: () => void
}) {
  const [activeSpec, setActiveSpec] = useState<number | null>(null)

  return (
    <div
      className="aspect-square"
      style={{
        perspective: "700px",
      }}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <button
          type="button"
          onClick={onFlip}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-card/60 p-3 backdrop-blur-sm transition-colors active:bg-muted/20"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="relative size-12">
            <Image
              src={cls.iconRemasteredUrl || cls.iconUrl}
              alt={cls.name}
              fill
              className="rounded-xl object-contain"
            />
          </div>
          <span
            className="w-full truncate text-center text-[10px] font-semibold"
            style={{
              color: cssColor(cls.slug),
            }}
          >
            {cls.name}
          </span>
        </button>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col rounded-2xl border p-2 overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderColor: `color-mix(in srgb, ${cssColor(cls.slug)} 35%, transparent)`,
            background: `color-mix(in srgb, ${cssColor(cls.slug)} 10%, var(--color-card, hsl(var(--card))))`,
          }}
        >
          {/* Back header — tap to flip back */}
          <button
            type="button"
            onClick={onFlip}
            className="mb-1.5 shrink-0 text-left text-[9px] font-bold uppercase tracking-widest opacity-70"
            style={{
              color: cssColor(cls.slug),
            }}
          >
            {cls.name}
          </button>

          {/* Spec list */}
          <div className="flex flex-col gap-px overflow-y-auto">
            {cls.specs.map((spec) => {
              const isActive = activeSpec === spec.id
              return (
                <div key={spec.id}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveSpec(isActive ? null : spec.id)
                    }}
                    className={cn(
                      "flex w-full items-center gap-1.5 rounded-lg px-1.5 py-1 transition-colors",
                      isActive ? "bg-white/10" : "active:bg-white/5",
                    )}
                  >
                    <Image
                      src={spec.iconRemasteredUrl || spec.iconUrl}
                      alt={spec.name}
                      width={16}
                      height={16}
                      className="shrink-0 rounded-sm"
                    />
                    <span className="truncate text-[9px] capitalize text-muted-foreground">
                      {spec.name}
                    </span>
                  </button>

                  {/* Bracket queue pills */}
                  <div
                    className={cn(
                      "grid transition-all duration-200",
                      isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-wrap gap-1 pb-1 pl-6 pt-0.5">
                        {BRACKETS.map((bracket, i) => (
                          <Link
                            key={bracket.slug}
                            href={`/pvp/${cls.slug}/${spec.name}/${bracket.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="animate-pill-in rounded-full px-2 py-0.5 text-[8px] font-semibold"
                            style={{
                              border: `1px solid ${cssColor(cls.slug)}`,
                              color: cssColor(cls.slug),
                              animationDelay: `${i * 60}ms`,
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
    </div>
  )
}

export function ClassGrid({ classes }: Props) {
  const [flipped, setFlipped] = useState<WowClassSlug | null>(null)
  const setHoverSlug = useSetHoverSlug()

  function handleFlip(slug: WowClassSlug) {
    const next = flipped === slug ? null : slug
    setFlipped(next)
    setHoverSlug(next)
  }

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {classes.map((cls) => (
        <ClassCard
          key={cls.slug}
          cls={cls}
          isFlipped={flipped === cls.slug}
          onFlip={() => handleFlip(cls.slug as WowClassSlug)}
        />
      ))}
    </div>
  )
}
