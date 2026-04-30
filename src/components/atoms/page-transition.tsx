"use client"

import { useEffect } from "react"

// Fires startViewTransition on browser back/forward so CSS ::view-transition-* rules apply
export function PageTransition() {
  useEffect(() => {
    if (!("startViewTransition" in document)) return

    const handler = () => {
      // Next.js has already initiated the navigation on popstate;
      // wrapping a no-op triggers the view-transition paint capture
      document.startViewTransition(() => {})
    }

    window.addEventListener("popstate", handler)
    return () => window.removeEventListener("popstate", handler)
  }, [])

  return null
}
