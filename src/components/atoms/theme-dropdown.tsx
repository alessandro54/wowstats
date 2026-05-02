"use client"

import { ChevronDown, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const THEME_OPTIONS = [
  {
    value: "system",
    label: "System",
    icon: Monitor,
  },
  {
    value: "light",
    label: "Light",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
  },
] as const

const THEME_LABELS: Record<string, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
}

interface Props {
  /**
   * Compact icon-only trigger for the collapsed sidebar. Drops the label
   * and chevron so the button fits in the rail's narrow footprint.
   */
  compact?: boolean
}

export function ThemeDropdown({ compact = false }: Props) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const current = theme ?? "system"
  const CurrentIcon = THEME_OPTIONS.find((o) => o.value === current)?.icon ?? Monitor
  const currentLabel = THEME_LABELS[current] ?? "Theme"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {compact ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Theme: ${currentLabel}`}
            title={`Theme: ${currentLabel}`}
            className="size-8 text-sidebar-foreground/70"
          >
            <CurrentIcon className="size-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sm text-sidebar-foreground/70"
          >
            <CurrentIcon className="size-4" />
            {currentLabel}
            <ChevronDown className="ml-auto size-3" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="min-w-[140px]">
        <DropdownMenuRadioGroup value={current} onValueChange={setTheme}>
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value} className="gap-2">
              <Icon className="size-3.5" />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
