"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useMemo, useState } from "react"
import { SlidingSwitch } from "@/components/atoms/sliding-switch"

const OPTIONS = [
  { value: "system", label: <Monitor size={14} /> },
  { value: "light", label: <Sun size={14} /> },
  { value: "dark", label: <Moon size={14} /> },
] as const

type ThemeValue = (typeof OPTIONS)[number]["value"]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const options = useMemo(
    () => OPTIONS.map(({ value, label }) => ({
      value,
      label: <span className="p-1.5 block">{label}</span>,
    })),
    [],
  )

  if (!mounted) return null

  return (
    <SlidingSwitch
      options={options}
      value={(theme ?? "system") as ThemeValue}
      onValueChange={setTheme}
    />
  )
}
