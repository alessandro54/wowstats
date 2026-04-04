"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"

const REGIONS = [
  {
    value: "all",
    label: "Global",
  },
  {
    value: "us",
    label: "US",
  },
  {
    value: "eu",
    label: "EU",
  },
] as const

export function RegionSwitcher() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get("region") ?? "all"

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
      {REGIONS.map(({ value, label }) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === "all") {
          params.delete("region")
        } else {
          params.set("region", value)
        }
        const href = `${pathname}${params.size > 0 ? `?${params.toString()}` : ""}`
        const isActive = current === value

        return (
          <Link
            key={value}
            href={href}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
