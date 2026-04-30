"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const tooltipInnerClass =
  "bg-card text-card-foreground border shadow-lg rounded-[inherit] px-3 py-1.5"
const tooltipArrowClass = "fill-slate-200 dark:fill-zinc-700"

export function ClickableTooltip({
  children,
  content,
  side,
  align,
  borderColor,
}: {
  children: ReactNode
  content: ReactNode
  side: "left" | "bottom" | "top" | "right"
  align: "center" | "end" | "start"
  borderColor?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild onClick={() => setOpen((v) => !v)}>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={8}
        collisionPadding={12}
        className="border-0 bg-transparent p-0 shadow-none"
        arrowClassName={tooltipArrowClass}
      >
        <div
          className={tooltipInnerClass}
          style={{
            borderColor: borderColor ?? "var(--color-border)",
          }}
        >
          {content}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
