"use client"

import { useState, type ReactNode } from "react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

const tooltipInnerClass = "bg-card text-card-foreground border border-border shadow-lg rounded-[inherit] px-3 py-1.5"
const tooltipArrowClass = "fill-slate-200 dark:fill-zinc-700"

export function ClickableTooltip({ children, content, side, align }: {
  children: ReactNode
  content: ReactNode
  side: "left" | "bottom" | "top" | "right"
  align: "center" | "end" | "start"
}) {
  const [open, setOpen] = useState(false)
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild onClick={() => setOpen((v) => !v)}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} align={align} sideOffset={8} collisionPadding={12} className="bg-transparent border-0 shadow-none p-0" arrowClassName={tooltipArrowClass}>
        <div className={tooltipInnerClass}>{content}</div>
      </TooltipContent>
    </Tooltip>
  )
}
