import { formatSlot, QUALITY_COLORS, SLOT_ORDER } from "@/config/equipment-config"
import type { CharacterEquipmentItem } from "@/lib/api"
import { iconUrl } from "@/config/cdn-config"

interface Props {
  items: CharacterEquipmentItem[]
}

function qualityColor(quality: string | null): string {
  return quality ? (QUALITY_COLORS[quality.toUpperCase()] ?? "#ffffff") : "#ffffff"
}

export function CharacterEquipment({ items }: Props) {
  if (items.length === 0) return null

  const bySlot = new Map(
    items.map((i) => [
      i.slot.toUpperCase(),
      i,
    ]),
  )

  const sorted = SLOT_ORDER.flatMap((slot) => {
    const item = bySlot.get(slot)
    return item
      ? [
          {
            slot,
            item,
          },
        ]
      : []
  })

  // Include any slots not in SLOT_ORDER
  for (const item of items) {
    const up = item.slot.toUpperCase()
    if (!SLOT_ORDER.includes(up)) {
      sorted.push({
        slot: up,
        item,
      })
    }
  }

  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold">Equipment</h2>
      <div className="rounded-lg border border-border bg-card/80 overflow-hidden">
        {sorted.map(({ slot, item }, idx) => (
          <div
            key={slot}
            className={`flex items-center gap-3 px-3 py-2 ${
              idx < sorted.length - 1 ? "border-b border-border/50" : ""
            }`}
          >
            {/* Icon */}
            <div className="relative shrink-0">
              {item.icon_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={iconUrl(item.icon_url, 32)}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded"
                  style={{
                    border: `1px solid ${qualityColor(item.quality)}33`,
                  }}
                />
              ) : (
                <div className="h-8 w-8 rounded bg-muted" />
              )}
              {item.item_level && (
                <span className="absolute -bottom-1 -right-1 rounded bg-background/90 px-0.5 text-[9px] font-bold tabular-nums leading-tight text-foreground">
                  {item.item_level}
                </span>
              )}
            </div>

            {/* Name + slot */}
            <div className="min-w-0 flex-1">
              <div
                className="truncate text-xs font-medium leading-tight"
                style={{
                  color: qualityColor(item.quality),
                }}
              >
                {item.name ?? formatSlot(slot)}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">{formatSlot(slot)}</span>
                {item.enchant && (
                  <>
                    <span className="text-[10px] text-muted-foreground/40">·</span>
                    <span className="text-[10px] text-emerald-400/80 truncate">{item.enchant}</span>
                  </>
                )}
              </div>
            </div>

            {/* Sockets */}
            {item.sockets.length > 0 && (
              <div className="flex shrink-0 flex-col gap-0.5 items-end">
                {item.sockets.map((socket, i) => (
                  <span
                    key={i}
                    className="max-w-[120px] truncate text-right text-[9px] text-yellow-400/80"
                  >
                    {socket}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
