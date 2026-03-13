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

export function ThemeDropdown() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const current = theme ?? "system"
  const CurrentIcon = THEME_OPTIONS.find((o) => o.value === current)?.icon ?? Monitor

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sm text-sidebar-foreground/70"
        >
          <CurrentIcon className="size-4" />
          {THEME_LABELS[current] ?? "Theme"}
          <ChevronDown className="ml-auto size-3" />
        </Button>
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
