"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
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

export function ClassHoneycomb({ classes }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const setHoverSlug = useSetHoverSlug()

  function toggle(i: number) {
    const next = i === selectedIdx ? null : i
    setSelectedIdx(next)
    if (next !== null) setHoverSlug(classes[i].slug as WowClassSlug)
  }

  return (
    <div className="flex flex-col divide-y divide-white/5">
      {classes.map((cls, i) => {
        const isOpen = selectedIdx === i
        const color = cssColor(cls.slug)

        return (
          <div key={cls.slug}>
            {/* Class row */}
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex w-full items-center gap-3 px-4 py-3 transition-colors duration-150 active:bg-white/5"
            >
              {/* Icon */}
              <div
                className="relative size-10 shrink-0 rounded-xl"
                style={{
                  boxShadow: isOpen
                    ? `0 0 0 2px ${color}, 0 0 14px color-mix(in srgb, ${color} 45%, transparent)`
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

              {/* Name */}
              <span
                className={cn(
                  "flex-1 text-left text-sm font-semibold transition-colors duration-150",
                  isOpen ? "text-foreground" : "text-muted-foreground",
                )}
                style={
                  isOpen
                    ? {
                        color,
                      }
                    : undefined
                }
              >
                {cls.name}
              </span>

              {/* Chevron */}
              <ChevronRight
                className="size-4 shrink-0 text-muted-foreground/50 transition-transform duration-200"
                style={{
                  transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* Specs — slide open */}
            <div
              className={cn(
                "grid transition-all duration-250",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-0.5 pb-2 pl-4 pr-4 pt-0.5">
                  {cls.specs.map((spec) => (
                    <div key={spec.id} className="flex items-center gap-2.5">
                      <div className="ml-2 size-1 shrink-0 rounded-full bg-white/20" />
                      <Image
                        src={spec.iconRemasteredUrl || spec.iconUrl}
                        alt={spec.name}
                        width={24}
                        height={24}
                        className="shrink-0 rounded-sm"
                      />
                      <span className="flex-1 text-sm capitalize text-muted-foreground">
                        {spec.name}
                      </span>
                      <div className="flex gap-1.5">
                        {BRACKETS.map((bracket) => (
                          <Link
                            key={bracket.slug}
                            href={`/pvp/${cls.slug}/${spec.name}/${bracket.slug}`}
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors"
                            style={{
                              border: `1px solid color-mix(in srgb, ${color} 50%, transparent)`,
                              color,
                            }}
                          >
                            {bracket.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
