"use client"

import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import type { CharacterEquipmentItem } from "@/lib/api"
import { useActiveColor } from "@/hooks/use-active-color"
import { CenterCard } from "./center-card"
import { SlotCard } from "./slot-card"

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

/**
 * Character equipment paper-doll. Renders left/right slot columns with a
 * center card showing portrait, name, ilvl, and stat bars.
 *
 * Returns null if items is empty (not a loading state — caller handles).
 */
export function CharacterEquipment({
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

        <div className="flex flex-col gap-2 xl:col-start-1 xl:row-start-1">
          {LEFT_SLOTS.map((slot) => renderSlot(slot, "left"))}
        </div>

        <div className="flex flex-col gap-2 xl:col-start-3 xl:row-start-1">
          {RIGHT_SLOTS.map((slot) => renderSlot(slot, "right"))}
        </div>
      </div>
    </section>
  )
}
