"use client"

import Image from "next/image"

export interface MetaBarEntry {
  key: string
  specName: string
  percentage: number
  color: string
  iconUrl?: string
}

export function MetaBarChart({ entries }: { entries: MetaBarEntry[] }) {
  return (
    <div className="flex h-full flex-1 flex-row items-end justify-center gap-2 overflow-x-auto pb-2">
      {entries.map(({ key, specName, percentage, color, iconUrl }) => (
        <div key={key} className="flex h-100 w-12 min-w-12 flex-col items-center">
          <div className="flex h-full w-full flex-col items-center justify-end">
            <div className="bg-muted flex h-full w-8 items-end rounded-full">
              <div
                className="w-full rounded-full"
                style={{ height: `${percentage}%`, backgroundColor: color, minHeight: "8px" }}
              />
            </div>
          </div>
          {iconUrl && (
            <Image src={iconUrl} alt={specName} className="mt-2 mb-1 h-6 w-6 rounded-full" />
          )}
          <span className="max-w-10 truncate text-center text-[10px] font-medium">{specName}</span>
        </div>
      ))}
    </div>
  )
}
