"use client"

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

interface Props {
  current?: string
  onSwitch?: (region: string) => void
}

export function RegionSwitcher({ current = "all", onSwitch }: Props) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
      {REGIONS.map(({ value, label }) => {
        const isActive = current === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSwitch?.(value)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
