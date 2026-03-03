"use client"

import Image from "next/image"

export type MetaBarEntry = {
  key: string
  specName: string
  percentage: number
  color: string
  iconUrl?: string
}

export function MetaBarChart({ entries }: { entries: MetaBarEntry[] }) {
  return (
    <div className="flex flex-row gap-2 overflow-x-auto pb-2 h-full items-end justify-center flex-1">
      {entries.map(({ key, specName, percentage, color, iconUrl }) => (
        <div key={key} className="flex flex-col items-center min-w-12 w-12 h-100">
          <div className="flex flex-col items-center justify-end h-full w-full">
            <div className="w-8 bg-muted rounded-full flex items-end h-full">
              <div
                className="w-full rounded-full"
                style={{ height: `${percentage}%`, backgroundColor: color, minHeight: "8px" }}
              />
            </div>
          </div>
          {iconUrl && (
            <Image src={iconUrl} alt={specName} className="h-6 w-6 rounded-full mb-1 mt-2" />
          )}
          <span className="font-medium text-[10px] text-center truncate max-w-10">{specName}</span>
        </div>
      ))}
    </div>
  )
}
