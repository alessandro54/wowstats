"use client"

import type { ReactNode } from "react"
import { CursorTooltip } from "@/components/atoms/cursor-tooltip"

/**
 * Backwards-compatible wrapper. Delegates to the cursor-following tooltip.
 * `side`/`align` are ignored — the tooltip auto-positions next to the cursor.
 */
export function ClickableTooltip({
  children,
  content,
  borderColor,
}: {
  children: ReactNode
  content: ReactNode
  side?: "left" | "bottom" | "top" | "right"
  align?: "center" | "end" | "start"
  borderColor?: string
}) {
  return (
    <CursorTooltip content={content} borderColor={borderColor}>
      {children}
    </CursorTooltip>
  )
}
