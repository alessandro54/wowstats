"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { LazyImage } from "@/components/atoms/lazy-image"
import { bracketOrder, PlayerEntryRow } from "@/components/molecules/player-hover-card-entry"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import { classColor } from "@/hooks/use-active-color"
import type { CharacterProfile } from "@/lib/api"
import { formatRealm } from "@/lib/utils"

const CARD_OFFSET = 16

export function PlayerHoverFloatingCard({
  profile,
  x,
  y,
  interactive,
}: {
  profile: CharacterProfile
  x: number
  y: number
  interactive: boolean
}) {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [coords, setCoords] = useState<{
    left: number
    top: number
  } | null>(null)

  useEffect(() => setTarget(document.body), [])

  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    const w = el.offsetWidth
    const h = el.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight
    const pad = 8

    let left = x + CARD_OFFSET
    if (left + w + pad > vw) left = x - CARD_OFFSET - w
    left = Math.max(pad, Math.min(left, vw - w - pad))

    let top = y + CARD_OFFSET
    if (top + h + pad > vh) top = y - CARD_OFFSET - h
    top = Math.max(pad, Math.min(top, vh - h - pad))

    setCoords({
      left,
      top,
    })
  }, [
    x,
    y,
  ])

  if (!target) return null

  const cls = WOW_CLASSES.find((c) => c.slug === profile.class_slug)
  const primarySpec = cls?.specs.find((s) => s.id === profile.primary_spec_id) ?? null
  const color = profile.class_slug ? classColor(profile.class_slug as WowClassSlug) : undefined
  const sortedEntries = [
    ...profile.pvp_entries,
  ].sort((a, b) => {
    const ord = bracketOrder(a.bracket) - bracketOrder(b.bracket)
    return ord !== 0 ? ord : b.rating - a.rating
  })

  return createPortal(
    <div
      ref={cardRef}
      data-player-card=""
      className={`fixed z-[1000] w-[280px] rounded-xl border border-border bg-popover/95 p-3 shadow-xl backdrop-blur-md ${interactive ? "" : "pointer-events-none"}`}
      style={{
        left: coords?.left ?? -9999,
        top: coords?.top ?? -9999,
        visibility: coords ? "visible" : "hidden",
      }}
    >
      <div className="flex items-center gap-3">
        {profile.avatar_url && (
          <LazyImage
            src={profile.avatar_url}
            alt=""
            width={44}
            height={44}
            className="shrink-0 rounded-lg"
          />
        )}
        <div className="min-w-0 flex-1">
          <div
            className="truncate text-sm font-bold"
            style={{
              color,
            }}
          >
            {profile.name}
          </div>
          <div className="truncate text-[11px] text-muted-foreground">
            {formatRealm(profile.realm)} · {profile.region.toUpperCase()}
          </div>
          {(cls || primarySpec) && (
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              {primarySpec?.iconUrl && (
                <LazyImage
                  src={primarySpec.iconUrl}
                  alt=""
                  width={14}
                  height={14}
                  className="rounded-sm"
                />
              )}
              <span className="capitalize">{primarySpec?.name ?? ""}</span>
              <span>{cls?.name ?? ""}</span>
            </div>
          )}
        </div>
      </div>

      {sortedEntries.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            Active queues
          </div>
          {sortedEntries.map((e, i) => (
            <PlayerEntryRow
              key={`${e.bracket}-${e.region}-${i}`}
              entry={e}
              fallbackClass={cls?.slug}
            />
          ))}
        </div>
      )}
    </div>,
    target,
  )
}
