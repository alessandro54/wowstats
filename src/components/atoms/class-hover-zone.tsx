"use client"

import { useSetHoverSlug } from "@/components/providers/hover-provider"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { cn } from "@/lib/utils"

interface Props {
  slug: WowClassSlug
  className?: string
  children: React.ReactNode
}

export function ClassHoverZone({ slug, className, children }: Props) {
  const setSlug = useSetHoverSlug()
  return (
    <div
      className={cn(className)}
      onMouseEnter={() => setSlug(slug)}
      onMouseLeave={() => setSlug(null)}
    >
      {children}
    </div>
  )
}
