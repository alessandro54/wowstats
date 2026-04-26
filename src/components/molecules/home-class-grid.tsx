"use client"

import Image from "next/image"
import { TransitionLink as Link } from "@/components/atoms/transition-link"
import { useState, useEffect } from "react"
import { useSetHoverSlug } from "@/components/providers/hover-provider"
import type { WowClassConfig, WowClassSlug } from "@/config/wow/classes/classes-config"
import { titleizeSlug } from "@/lib/utils"

interface Props {
  classes: WowClassConfig[]
}

export function HomeClassGrid({ classes }: Props) {
  const setHoverSlug = useSetHoverSlug()
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  useEffect(() => {
    for (const cls of classes) {
      for (const spec of cls.specs) {
        const src = spec.iconRemasteredUrl || spec.iconUrl
        if (!src) continue
        const link = document.createElement("link")
        link.rel = "preload"
        link.as = "image"
        link.href = src
        document.head.appendChild(link)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeClass = activeSlug ? classes.find((c) => c.slug === activeSlug) : null

  const handleToggle = (slug: WowClassSlug) => {
    if (activeSlug === slug) {
      setActiveSlug(null)
      setHoverSlug(null)
    } else {
      setActiveSlug(slug)
      setHoverSlug(slug)
    }
  }

  const handleEnter = (slug: WowClassSlug) => {
    setActiveSlug(slug)
    setHoverSlug(slug)
  }

  const handleLeave = () => {
    setActiveSlug(null)
    setHoverSlug(null)
  }

  const renderCard = (cls: WowClassConfig) => {
    const color = `var(--color-class-${cls.slug})`
    const isActive = activeSlug === cls.slug
    const hasActive = activeSlug !== null

    return (
      <div
        key={cls.slug}
        className={`relative ${isActive ? "z-10" : ""}`}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") handleEnter(cls.slug as WowClassSlug)
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") handleLeave()
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onTouchEnd={(e) => {
            e.preventDefault()
            handleToggle(cls.slug as WowClassSlug)
          }}
          onClick={() => handleToggle(cls.slug as WowClassSlug)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleToggle(cls.slug as WowClassSlug)
          }}
          className={`group flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 transition-all sm:h-36 sm:gap-3 ${
            hasActive && !isActive ? "opacity-40 scale-[0.97]" : ""
          }`}
          style={{
            borderColor: `color-mix(in srgb, ${color} ${isActive ? "50%" : "30%"}, transparent)`,
            backgroundColor: `color-mix(in srgb, ${color} ${isActive ? "10%" : "5%"}, transparent)`,
          }}
        >
          <Image
            src={cls.iconRemasteredUrl || cls.iconUrl}
            alt={cls.name}
            width={80}
            height={80}
            className="size-14 rounded-xl opacity-70 transition-opacity group-hover:opacity-100 sm:size-20"
          />
          <span
            className="text-xs font-semibold transition-colors sm:text-sm"
            style={{
              color,
            }}
          >
            {cls.name}
          </span>
        </div>

        {/* Desktop dropdown — absolute below card */}
        {isActive && (
          <div className="absolute left-1/2 top-full z-30 hidden -translate-x-1/2 pt-1 sm:block">
            <SpecDropdown cls={cls} color={color} />
          </div>
        )}
      </div>
    )
  }

  const firstRow = classes.slice(0, 7)
  const secondRow = classes.slice(7)

  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Select a Class
        </p>
        <div className="ml-2 h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>
      {/* Mobile: 4 rows of 3 centered, last row centered separately */}
      <div className="flex flex-col items-center gap-2 sm:hidden">
        <div className="grid w-full grid-cols-3 gap-2">{classes.slice(0, 12).map(renderCard)}</div>
        <div
          className="grid grid-cols-1 gap-2"
          style={{
            width: "calc(33.333% - 0.333rem)",
          }}
        >
          {classes.slice(12).map(renderCard)}
        </div>
      </div>
      <div className="hidden flex-col items-center gap-3 sm:flex">
        <div className="grid w-full grid-cols-7 gap-3">{firstRow.map(renderCard)}</div>
        <div className="grid w-full max-w-[85.7%] grid-cols-6 gap-3">
          {secondRow.map(renderCard)}
        </div>
      </div>

      {/* Mobile dropdown — fixed to bottom of viewport */}
      {activeClass && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:hidden">
          <div
            className="mx-auto max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <SpecDropdown cls={activeClass} color={`var(--color-class-${activeClass.slug})`} />
          </div>
          {/* Backdrop */}
          <div
            className="fixed inset-0 -z-10 bg-black/40"
            onClick={() => {
              setActiveSlug(null)
              setHoverSlug(null)
            }}
          />
        </div>
      )}
    </div>
  )
}

function SpecDropdown({ cls, color }: { cls: WowClassConfig; color: string }) {
  return (
    <div className="flex justify-center gap-2 rounded-xl border border-border/30 bg-background/60 p-3 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150 sm:gap-2">
      {cls.specs.map((spec) => (
        <Link
          key={spec.id}
          href={spec.url}
          className="group/spec flex w-20 flex-col items-center gap-2.5 rounded-xl py-4 transition-colors hover:bg-muted/50"
        >
          <span className="icon-vignette block size-12 shrink-0 overflow-hidden rounded-xl">
            <Image
              src={spec.iconRemasteredUrl || spec.iconUrl}
              alt={spec.name}
              width={48}
              height={48}
              className="block h-full w-full rounded-xl object-cover opacity-70 transition-opacity group-hover/spec:opacity-100"
            />
          </span>
          <span
            className="text-center text-[11px] font-semibold capitalize leading-tight"
            style={{
              color,
            }}
          >
            {titleizeSlug(spec.name)}
          </span>
        </Link>
      ))}
    </div>
  )
}
