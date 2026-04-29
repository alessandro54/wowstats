"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import type { MetaTalent } from "@/lib/api"
import { iconUrl } from "@/config/cdn-config"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  talent: MetaTalent
  activeColor: string
}

export function PvpTalentTooltip({ talent, activeColor }: Props) {
  const [description, setDescription] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!talent.talent.id) {
      setLoading(false)
      return
    }
    fetch(`/api/pvp/meta/talents/${talent.talent.id}`)
      .then((r) => r.json())
      .then((d) => setDescription(d.description ?? null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [
    talent.talent.id,
  ])

  return (
    <div className="min-w-36 space-y-1.5">
      <div className="flex items-center gap-2">
        {talent.talent.icon_url && (
          <Image
            src={iconUrl(talent.talent.icon_url, 50)!}
            width={50}
            height={50}
            className="shrink-0 rounded-full"
            alt={talent.talent.name}
            unoptimized
          />
        )}
        <span className="text-xs font-semibold leading-tight">{talent.talent.name}</span>
      </div>
      {loading ? (
        <div className="space-y-1">
          <Skeleton className="h-2 w-48" />
          <Skeleton className="h-2 w-36" />
        </div>
      ) : description ? (
        <p className="text-muted-foreground max-w-52 text-[11px] leading-snug">{description}</p>
      ) : null}
      <p
        className="font-mono text-[11px] font-bold"
        style={{
          color: activeColor,
        }}
      >
        {talent.usage_pct.toFixed(1)}%
      </p>
    </div>
  )
}
