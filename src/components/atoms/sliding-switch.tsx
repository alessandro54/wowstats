"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useHoverSlug } from "@/components/providers/hover-provider"
import { cn } from "@/lib/utils"

interface Option<T extends string> {
  value: T
  label: React.ReactNode
}

interface SlidingSwitchProps<T extends string> {
  options: Option<T>[]
  value: T
  onValueChange: (value: T) => void
  bordered?: boolean
  className?: string
}

export function SlidingSwitch<T extends string>({
  options,
  value,
  onValueChange,
  bordered = true,
  className,
}: SlidingSwitchProps<T>) {
  const pathname = usePathname()
  const hoverSlug = useHoverSlug()

  const segments = pathname.split("/").filter(Boolean)
  const activeSlug = hoverSlug ?? (segments[0] === "pvp" ? segments[1] : segments[0])
  const accentColor = activeSlug
    ? `var(--color-class-${activeSlug}, var(--primary))`
    : "var(--primary)"

  const containerRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({
    opacity: 0,
  })

  useEffect(() => {
    if (!containerRef.current) return
    const activeIndex = options.findIndex((o) => o.value === value)
    if (activeIndex === -1) return
    // +1 to skip the indicator div itself
    const button = containerRef.current.children[activeIndex + 1] as HTMLElement
    if (!button) return
    setIndicatorStyle({
      width: button.offsetWidth,
      height: button.offsetHeight,
      transform: `translateX(${button.offsetLeft - 2}px)`,
      opacity: 1,
    })
  }, [
    value,
    options,
  ])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center gap-0.5 rounded-md bg-transparent p-0.5",
        bordered && "border",
        className,
      )}
    >
      <div
        className="absolute rounded shadow-sm transition-all duration-200 ease-in-out"
        style={{
          ...indicatorStyle,
          backgroundColor: accentColor,
          top: 2,
          left: 2,
        }}
      />
      {options.map(({ value: optValue, label }) => {
        const isActive = value === optValue
        return (
          <button
            key={optValue}
            type="button"
            onClick={() => onValueChange(optValue)}
            className={cn(
              "relative z-10 rounded transition-colors duration-200",
              isActive ? "text-[var(--background)]" : "text-muted-foreground",
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
