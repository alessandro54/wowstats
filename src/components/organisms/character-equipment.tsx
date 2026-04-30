"use client"

import Image from "next/image"
import { formatSlot, QUALITY_COLORS } from "@/config/equipment-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import type { CharacterEquipmentItem } from "@/lib/api"
import { iconUrl } from "@/config/cdn-config"
import { useActiveColor } from "@/hooks/use-active-color"

const LEFT_SLOTS = [
  "HEAD",
  "SHOULDER",
  "CHEST",
  "HANDS",
  "LEGS",
  "MAIN_HAND",
  "FINGER_1",
  "TRINKET_1",
]
const RIGHT_SLOTS = [
  "NECK",
  "BACK",
  "WRIST",
  "WAIST",
  "FEET",
  "OFF_HAND",
  "FINGER_2",
  "TRINKET_2",
]

const STAT_ORDER = [
  "VERSATILITY",
  "MASTERY_RATING",
  "HASTE_RATING",
  "CRIT_RATING",
] as const
const STAT_LABELS: Record<string, string> = {
  VERSATILITY: "Vers",
  MASTERY_RATING: "Mast",
  HASTE_RATING: "Hast",
  CRIT_RATING: "Crit",
}
const STAT_COLORS: Record<string, string> = {
  VERSATILITY: "var(--color-stat-versatility)",
  MASTERY_RATING: "var(--color-stat-mastery)",
  HASTE_RATING: "var(--color-stat-haste)",
  CRIT_RATING: "var(--color-stat-crit)",
}

export interface CharacterEquipmentProps {
  items: CharacterEquipmentItem[]
  classSlug: WowClassSlug
  characterName: string
  className: string
  specName?: string
  avatarUrl?: string | null
  specIconUrl?: string
  statPcts?: Record<string, number>
}

function qualityColor(quality: string | null): string {
  return quality ? (QUALITY_COLORS[quality.toUpperCase()] ?? "#ffffff") : "#9d9d9d"
}

function SlotCard({
  item,
  slot,
  side,
}: {
  item: CharacterEquipmentItem | undefined
  slot: string
  side: "left" | "right"
}) {
  const borderClass =
    side === "left"
      ? "border-t-2 md:border-t-0 md:border-l-2"
      : "border-t-2 md:border-t-0 md:border-r-2"

  if (!item) {
    return (
      <div
        className={`flex h-[72px] items-center gap-3 rounded-lg bg-card/20 px-3 py-2.5 opacity-30 ${borderClass}`}
        style={{
          borderColor: "rgb(100 100 100 / 0.3)",
        }}
      >
        <div className="size-9 shrink-0 rounded bg-muted/30" />
        <div className="min-w-0 flex-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            {formatSlot(slot)}
          </span>
          <p className="text-xs text-muted-foreground/40">Empty</p>
        </div>
      </div>
    )
  }

  const color = qualityColor(item.quality)

  return (
    <div
      className={`flex items-center gap-3 rounded-lg bg-card/30 px-3 py-2.5 backdrop-blur-sm transition-colors hover:bg-muted/20 ${borderClass}`}
      style={{
        borderColor: `${color}55`,
      }}
    >
      <div className="relative shrink-0">
        {item.icon_url ? (
          <Image
            src={iconUrl(item.icon_url, 36)!}
            alt={item.name ?? ""}
            width={36}
            height={36}
            className="block rounded"
            style={{
              border: `1px solid ${color}44`,
            }}
          />
        ) : (
          <div className="size-9 rounded bg-muted" />
        )}
        {item.item_level != null && (
          <span className="absolute -bottom-1 -right-1 rounded bg-background/90 px-0.5 text-[9px] font-bold tabular-nums leading-tight text-foreground">
            {item.item_level}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          {formatSlot(slot)}
        </span>
        <p
          className="truncate text-sm font-medium leading-tight"
          style={{
            color,
          }}
        >
          {item.name ?? formatSlot(slot)}
        </p>
        {item.enchant ? (
          <p className="truncate text-[10px] leading-tight text-lime-600 dark:text-[#00ff00]">
            {item.enchant}
          </p>
        ) : (
          <p className="text-[10px] leading-tight text-muted-foreground/30">—</p>
        )}
        {item.sockets.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {item.sockets.map((socket, i) =>
              socket.icon_url ? (
                <div key={i} className="flex items-center gap-1" title={socket.name}>
                  <Image
                    src={iconUrl(socket.icon_url, 16)!}
                    alt={socket.name}
                    width={16}
                    height={16}
                    className="block shrink-0 rounded-sm"
                  />
                  <span className="truncate text-[9px] text-yellow-400/80">{socket.name}</span>
                </div>
              ) : (
                <span key={i} className="text-[9px] text-yellow-400/80">
                  {socket.name}
                </span>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function CenterCard({
  classSlug,
  characterName,
  className,
  specName,
  avatarUrl,
  specIconUrl,
  avgIlvl,
  statPcts,
  activeColor,
}: {
  classSlug: WowClassSlug
  characterName: string
  className: string
  specName?: string
  avatarUrl?: string | null
  specIconUrl?: string
  avgIlvl: number | null
  statPcts?: Record<string, number>
  activeColor: string
}) {
  const portraitUrl = avatarUrl ?? specIconUrl

  const statVals = STAT_ORDER.map((k) => statPcts?.[k] ?? 0)
  const maxStat = Math.max(...statVals, 1)
  const hasStats = statVals.some((v) => v > 0)

  return (
    <div
      className="w-full rounded-xl border border-border/40 px-6 py-8 backdrop-blur-sm xl:w-72"
      style={{
        background: `linear-gradient(-45deg, color-mix(in oklch, var(--color-class-${classSlug}) 8%, transparent), transparent 60%)`,
      }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Portrait */}
        {portraitUrl && (
          <div
            className="rounded-full border-2 p-1"
            style={{
              borderColor: activeColor,
              background: `${activeColor}18`,
            }}
          >
            <Image
              src={portraitUrl}
              alt={characterName}
              width={72}
              height={72}
              className="size-16 rounded-full object-cover"
            />
          </div>
        )}

        {/* Name + class */}
        <div className="text-center leading-tight">
          <p
            className="text-sm font-bold uppercase tracking-wider"
            style={{
              color: activeColor,
            }}
          >
            {characterName}
          </p>
          <p className="text-sm font-bold text-foreground">{className}</p>
          {specName && (
            <p className="mt-0.5 text-[10px] text-muted-foreground capitalize">{specName}</p>
          )}
        </div>

        {/* Avg ilvl */}
        {avgIlvl != null && (
          <div className="flex flex-col items-center leading-none">
            <span
              className="text-2xl font-bold tabular-nums"
              style={{
                color: activeColor,
              }}
            >
              {avgIlvl}
            </span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
              Ilvl
            </span>
          </div>
        )}

        {/* Stat bars */}
        {hasStats && (
          <div className="w-full space-y-2 border-t border-border/30 pt-4">
            {STAT_ORDER.map((key, i) => {
              const val = statVals[i]
              if (val === 0) return null
              const color = STAT_COLORS[key]
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-7 shrink-0 text-[10px] text-muted-foreground">
                    {STAT_LABELS[key]}
                  </span>
                  <div className="h-1.5 flex-1 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(val / maxStat) * 100}%`,
                        background: color ?? activeColor,
                      }}
                    />
                  </div>
                  <span
                    className="w-8 shrink-0 text-right font-mono text-[10px]"
                    style={{
                      color: color ?? activeColor,
                    }}
                  >
                    {val}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function CharacterEquipmentInner({
  items,
  classSlug,
  characterName,
  className,
  specName,
  avatarUrl,
  specIconUrl,
  statPcts,
}: CharacterEquipmentProps) {
  const activeColor = useActiveColor(classSlug)

  const bySlot = new Map(
    items.map((i) => [
      i.slot.toUpperCase(),
      i,
    ]),
  )

  const ilvlItems = items.filter((i) => i.item_level != null)
  const avgIlvl =
    ilvlItems.length > 0
      ? Math.round(ilvlItems.reduce((s, i) => s + i.item_level!, 0) / ilvlItems.length)
      : null

  const renderSlot = (slot: string, side: "left" | "right") => (
    <SlotCard key={slot} slot={slot} item={bySlot.get(slot)} side={side} />
  )

  if (items.length === 0) return null

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Equipment
          </h2>
          <div className="ml-2 h-px w-16 bg-gradient-to-r from-border to-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1fr_auto_1fr]">
        {/* Center card — first in DOM, explicit xl placement */}
        <div className="flex justify-center md:col-span-2 xl:col-span-1 xl:col-start-2 xl:row-start-1">
          <CenterCard
            classSlug={classSlug}
            characterName={characterName}
            className={className}
            specName={specName}
            avatarUrl={avatarUrl}
            specIconUrl={specIconUrl}
            avgIlvl={avgIlvl}
            statPcts={statPcts}
            activeColor={activeColor}
          />
        </div>

        {/* Left column */}
        <div className="flex flex-col gap-2 xl:col-start-1 xl:row-start-1">
          {LEFT_SLOTS.map((slot) => renderSlot(slot, "left"))}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-2 xl:col-start-3 xl:row-start-1">
          {RIGHT_SLOTS.map((slot) => renderSlot(slot, "right"))}
        </div>
      </div>
    </section>
  )
}

export { CharacterEquipmentInner as CharacterEquipment }
