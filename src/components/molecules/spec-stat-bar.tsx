interface Props {
  winRate: number
  presence: number
  playerCount: number
  classColor: string
  children?: React.ReactNode
}

export function SpecStatBar({ winRate, presence, playerCount, classColor, children }: Props) {
  if (playerCount === 0) return null

  const pills = [
    {
      label: "Avg. Win Rate",
      value: `${(winRate * 100).toFixed(1)}%`,
      positive: winRate > 0.5,
    },
    {
      label: "Avg. Presence",
      value: `${(presence * 100).toFixed(1)}%`,
      positive: false,
    },
    {
      label: "Players Tracked",
      value: playerCount.toLocaleString(),
      positive: false,
    },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-border/30 pb-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {pills.map((pill) => (
          <div key={pill.label} className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {pill.label}
            </span>
            <span
              className="text-base font-bold tabular-nums"
              style={{
                color: pill.positive ? "var(--color-stat-versatility)" : classColor,
              }}
            >
              {pill.value}
            </span>
          </div>
        ))}
      </div>
      {children}
    </div>
  )
}
