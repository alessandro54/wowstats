"use client"

import Image from "next/image"
import Link from "next/link"
import { useSetHoverSlug } from "@/components/providers/hover-provider"
import type { WowClassConfig, WowClassSlug } from "@/config/wow/classes/classes-config"

interface Props {
  classes: WowClassConfig[]
}

export function HomeClassGrid({ classes }: Props) {
  const setHoverSlug = useSetHoverSlug()

  const renderCard = (cls: WowClassConfig) => {
    const color = `var(--color-class-${cls.slug})`
    const firstSpec = cls.specs[0]
    return (
      <Link
        key={cls.slug}
        href={`/pvp/${cls.slug}/${firstSpec.name}`}
        className="group flex h-28 w-full flex-col items-center justify-center gap-2.5 rounded-2xl border-2 transition-all"
        style={{
          borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
          backgroundColor: `color-mix(in srgb, ${color} 5%, transparent)`,
        }}
        onMouseEnter={() => setHoverSlug(cls.slug as WowClassSlug)}
        onMouseLeave={() => setHoverSlug(null)}
      >
        <Image
          src={cls.iconRemasteredUrl || cls.iconUrl}
          alt={cls.name}
          width={72}
          height={72}
          className="rounded-xl opacity-70 transition-opacity group-hover:opacity-100"
        />
        <span
          className="text-xs font-semibold transition-colors"
          style={{
            color,
          }}
        >
          {cls.name}
        </span>
      </Link>
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
      <div className="flex flex-col items-center gap-3">
        <div className="grid w-full grid-cols-4 gap-3 sm:grid-cols-7">
          {firstRow.map(renderCard)}
        </div>
        <div className="grid w-full grid-cols-4 gap-3 sm:grid-cols-6 sm:max-w-[85.7%]">
          {secondRow.map(renderCard)}
        </div>
      </div>
    </div>
  )
}
