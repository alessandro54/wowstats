"use client"

import { useEffect } from "react"
import { useTopNav } from "@/components/providers/top-nav-provider"

interface Props {
  left?: React.ReactNode
  center?: React.ReactNode
  hidden?: boolean
}

/**
 * Renderless component — mount it anywhere in the tree to configure the global TopNav.
 * Use `key` to force remount when config should change (e.g. `key={bracket ?? "index"}`).
 */
export function TopNavConfig({ left, center, hidden }: Props) {
  const { set, reset } = useTopNav()

  useEffect(() => {
    set({ left, center, hidden })
    return reset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
