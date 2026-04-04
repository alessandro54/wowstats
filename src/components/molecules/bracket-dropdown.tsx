"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const BRACKETS = [
  {
    value: "2v2",
    label: "2v2",
  },
  {
    value: "3v3",
    label: "3v3",
  },
  {
    value: "shuffle-overall",
    label: "Solo Shuffle",
  },
  {
    value: "blitz-overall",
    label: "Blitz",
  },
] as const

export function BracketDropdown({ current }: { current: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const currentLabel = BRACKETS.find((b) => b.value === current)?.label ?? current

  // Replace the bracket segment in the current path
  const hrefFor = (bracket: string) => {
    const segments = pathname.split("/")
    // /pvp/meta/[bracket]/[role] → segments[3] is the bracket
    segments[3] = bracket
    return segments.join("/")
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-foreground/80"
      >
        {currentLabel}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M3 5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[140px] rounded-md border border-border bg-popover p-1 shadow-md">
          {BRACKETS.map(({ value, label }) => (
            <Link
              key={value}
              href={hrefFor(value)}
              onClick={() => setOpen(false)}
              className={`block rounded-sm px-3 py-1.5 text-sm transition-colors ${
                value === current
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-accent/50"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
