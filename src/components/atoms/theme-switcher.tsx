"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useHoverSlug } from "@/components/providers/hover-provider"
import { cn } from "@/lib/utils"

const OPTIONS = [
  { value: "system", icon: Monitor },
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
] as const

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const hoverSlug = useHoverSlug()

  useEffect(() => setMounted(true), [])

  // Stable click handlers — only recreated if setTheme changes (never in practice)
  const handlers = useMemo(
    () => Object.fromEntries(OPTIONS.map(({ value }) => [value, () => setTheme(value)])),
    [setTheme],
  )

  // Recomputed only when pathname or hoverSlug changes, not on every hover-unrelated render
  const classColor = useMemo(() => {
    const pathClassSlug = pathname.split("/").filter(Boolean)[0]
    const activeSlug = hoverSlug ?? pathClassSlug
    return activeSlug ? `var(--color-class-${activeSlug}, var(--border))` : "var(--border)"
  }, [hoverSlug, pathname])

  return (
    <div
      className="flex items-center gap-0.5 rounded-md border bg-transparent p-0.5"
      style={{ borderColor: classColor }}
    >
      {OPTIONS.map(({ value, icon: Icon }) => {
        const isActive = mounted && theme === value
        return (
          <button
            key={value}
            onClick={handlers[value]}
            style={
              isActive ? { backgroundColor: classColor, color: "var(--background)" } : undefined
            }
            className={cn(
              "rounded p-1.5 transition-colors",
              isActive ? "shadow-sm" : "text-muted-foreground",
            )}
            aria-label={value}
          >
            <Icon size={14} />
          </button>
        )
      })}
    </div>
  )
}
