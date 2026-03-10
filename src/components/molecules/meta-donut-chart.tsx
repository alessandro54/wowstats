"use client"

import Image from "next/image"
import { useState } from "react"

export interface DonutSlice {
  key: string
  label: string
  value: number // games_share fraction (0-1)
  color: string
  iconUrl?: string
}

interface Props {
  slices: DonutSlice[]
}

const CX = 50
const CY = 50
const OUTER_R = 42
const INNER_R = 27
const GAP_DEG = 0.5
const OTHER_THRESHOLD = 0.02

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): {
  x: number
  y: number
} {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function slicePath(
  cx: number,
  cy: number,
  ro: number,
  ri: number,
  startDeg: number,
  endDeg: number,
): string {
  const outerStart = polarToCartesian(cx, cy, ro, startDeg)
  const outerEnd = polarToCartesian(cx, cy, ro, endDeg)
  const innerStart = polarToCartesian(cx, cy, ri, startDeg)
  const innerEnd = polarToCartesian(cx, cy, ri, endDeg)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${ro} ${ro} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${ri} ${ri} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ")
}

interface ComputedSlice {
  key: string
  label: string
  value: number
  color: string
  iconUrl?: string
  startDeg: number
  endDeg: number
  midDeg: number
}

function buildSlices(rawSlices: DonutSlice[]): ComputedSlice[] {
  const sorted = [
    ...rawSlices,
  ].sort((a, b) => b.value - a.value)

  const main: DonutSlice[] = []
  let otherValue = 0

  for (const s of sorted) {
    if (s.value < OTHER_THRESHOLD) {
      otherValue += s.value
    } else {
      main.push(s)
    }
  }

  const withOther: DonutSlice[] = [
    ...main,
  ]
  if (otherValue > 0) {
    withOther.push({
      key: "__other__",
      label: "Other",
      value: otherValue,
      color: "#6b7280",
    })
  }

  const total = withOther.reduce((s, d) => s + d.value, 0) || 1
  let currentDeg = 0
  const computed: ComputedSlice[] = []

  for (const slice of withOther) {
    const sliceDeg = (slice.value / total) * 360
    const startDeg = currentDeg + GAP_DEG
    const endDeg = currentDeg + sliceDeg - GAP_DEG
    const midDeg = (startDeg + endDeg) / 2

    computed.push({
      ...slice,
      startDeg,
      endDeg,
      midDeg,
    })

    currentDeg += sliceDeg
  }

  return computed
}

export function MetaDonutChart({ slices }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const computed = buildSlices(slices)

  const hoveredSlice = computed.find((s) => s.key === hovered)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* SVG donut */}
      <div className="relative shrink-0 self-center">
        <svg viewBox="0 0 100 100" width={180} height={180} className="overflow-visible">
          {computed.map((slice) => {
            const isHovered = slice.key === hovered
            const path = slicePath(
              CX,
              CY,
              isHovered ? OUTER_R + 2 : OUTER_R,
              INNER_R,
              slice.startDeg,
              slice.endDeg,
            )
            return (
              <path
                key={slice.key}
                d={path}
                fill={slice.color}
                opacity={hovered && !isHovered ? 0.4 : 1}
                style={{
                  cursor: "pointer",
                  transition: "opacity 0.15s, d 0.15s",
                }}
                onMouseEnter={() => setHovered(slice.key)}
                onMouseLeave={() => setHovered(null)}
              />
            )
          })}

          {/* Center label */}
          <text
            x={CX}
            y={CY - 4}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={hoveredSlice ? 7 : 6}
            fill="currentColor"
            className="fill-foreground font-semibold"
            style={{
              pointerEvents: "none",
            }}
          >
            {hoveredSlice ? hoveredSlice.label : "Presence"}
          </text>
          <text
            x={CX}
            y={CY + 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={8}
            fill="currentColor"
            className="fill-muted-foreground font-mono"
            style={{
              pointerEvents: "none",
            }}
          >
            {hoveredSlice ? `${(hoveredSlice.value * 100).toFixed(1)}%` : ""}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <ol
        className="flex min-w-0 flex-1 flex-col gap-1 overflow-y-auto"
        style={{
          maxHeight: 220,
        }}
      >
        {computed.map((slice) => (
          <li
            key={slice.key}
            className="flex cursor-default items-center gap-2 rounded px-1.5 py-0.5 transition-colors"
            style={{
              backgroundColor: slice.key === hovered ? `${slice.color}22` : undefined,
            }}
            onMouseEnter={() => setHovered(slice.key)}
            onMouseLeave={() => setHovered(null)}
          >
            {slice.iconUrl && slice.key !== "__other__" ? (
              <Image
                src={slice.iconUrl}
                alt={slice.label}
                width={14}
                height={14}
                className="rounded-sm"
                unoptimized
              />
            ) : (
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-sm"
                style={{
                  backgroundColor: slice.color,
                }}
              />
            )}
            <span
              className="min-w-0 flex-1 truncate text-[11px] text-foreground"
              style={{
                opacity: hovered && slice.key !== hovered ? 0.5 : 1,
              }}
            >
              {slice.label}
            </span>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
              {(slice.value * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
