"use client"

import Image from "next/image"
import { formatSlot, QUALITY_COLORS } from "@/config/equipment-config"
import { iconUrl } from "@/config/cdn-config"
import type { CharacterEquipmentItem } from "@/lib/api"

function qualityColor(quality: string | null): string {
  return quality ? (QUALITY_COLORS[quality.toUpperCase()] ?? "#ffffff") : "#9d9d9d"
}

interface Props {
  item: CharacterEquipmentItem | undefined
  slot: string
  side: "left" | "right"
}

export function SlotCard({ item, slot, side }: Props) {
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
