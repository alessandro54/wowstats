"use client"

import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { createContext, use, useState } from "react"

// Split into two contexts so setter-only consumers don't re-render on slug changes
const HoverSlugContext = createContext<WowClassSlug | null>(null)
const SetHoverSlugContext = createContext<(slug: WowClassSlug | null) => void>(() => {})

export function HoverProvider({ children }: { children: React.ReactNode }) {
  const [slug, setSlug] = useState<WowClassSlug | null>(null)

  return (
    <SetHoverSlugContext value={setSlug}>
      <HoverSlugContext value={slug}>{children}</HoverSlugContext>
    </SetHoverSlugContext>
  )
}

/** Re-renders when the hovered class slug changes. */
export function useHoverSlug(): WowClassSlug | null {
  return use(HoverSlugContext)
}

/** Stable setter — never triggers a re-render in the consumer. */
export function useSetHoverSlug(): (slug: WowClassSlug | null) => void {
  return use(SetHoverSlugContext)
}
