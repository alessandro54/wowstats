"use client";

import { createContext, useContext, useState } from "react";
import type { WowClassSlug } from "@/config/wow/classes";

// Split into two contexts so setter-only consumers don't re-render on slug changes
const HoverSlugContext = createContext<WowClassSlug | null>(null);
const SetHoverSlugContext = createContext<(slug: WowClassSlug | null) => void>(() => {});

export function HoverProvider({ children }: { children: React.ReactNode }) {
  const [slug, setSlug] = useState<WowClassSlug | null>(null);

  return (
    <SetHoverSlugContext.Provider value={setSlug}>
      <HoverSlugContext.Provider value={slug}>
        {children}
      </HoverSlugContext.Provider>
    </SetHoverSlugContext.Provider>
  );
}

/** Re-renders when the hovered class slug changes. */
export function useHoverSlug(): WowClassSlug | null {
  return useContext(HoverSlugContext);
}

/** Stable setter — never triggers a re-render in the consumer. */
export function useSetHoverSlug(): (slug: WowClassSlug | null) => void {
  return useContext(SetHoverSlugContext);
}
