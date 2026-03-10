"use client"

import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { useHoverSlug } from "@/components/providers/hover-provider"

export function classColor(slug: WowClassSlug | null | undefined): string | undefined {
  if (!slug) return undefined
  return `var(--color-class-${slug})`
}

export function useActiveColor(defaultSlug: WowClassSlug): string
export function useActiveColor(defaultSlug?: WowClassSlug | null): string | undefined
export function useActiveColor(defaultSlug?: WowClassSlug | null): string | undefined {
  const hoverSlug = useHoverSlug()
  const activeSlug = hoverSlug ?? defaultSlug ?? null
  if (!activeSlug) return `var(--color-primary)`
  return `var(--color-class-${activeSlug})`
}
