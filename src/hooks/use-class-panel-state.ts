"use client"

import { useRef, useState } from "react"
import { useSetHoverSlug } from "@/components/providers/hover-provider"
import type { WowClassConfig, WowClassSlug } from "@/config/wow/classes/classes-config"
import { flexForDistance } from "@/lib/wow/flex-for-distance"

export interface ClassPanelState {
  active: string | null
  hovered: WowClassSlug | null
  hoveredSpec: number | null
  activeSpec: number | null
  isDragging: boolean
  activeIndex: number
  activeClass: WowClassConfig | null
  thumbPercent: number | null
  sliderRef: React.RefObject<HTMLDivElement | null>
  handleMouseEnter: (slug: WowClassSlug) => void
  handleMouseLeave: () => void
  handlePanelMouseLeave: () => void
  handlePanelClick: (slug: WowClassSlug, e: React.MouseEvent) => void
  handleSliderPointerDown: (e: React.PointerEvent) => void
  handleSliderPointerMove: (e: React.PointerEvent) => void
  handleSliderPointerUp: () => void
  setHoveredSpec: (id: number | null) => void
  setActiveSpec: (id: number | null) => void
  flexGrowForIndex: (index: number) => number
}

export function useClassPanelState(classes: WowClassConfig[]): ClassPanelState {
  const [active, setActive] = useState<WowClassSlug | null>(null)
  const [hovered, setHovered] = useState<WowClassSlug | null>(null)
  const [hoveredSpec, setHoveredSpec] = useState<number | null>(null)
  const [activeSpec, setActiveSpec] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const setHoverSlug = useSetHoverSlug()
  const sliderRef = useRef<HTMLDivElement>(null)

  const N = classes.length
  const activeIndex = active ? classes.findIndex((c) => c.slug === active) : -1
  const activeClass = activeIndex >= 0 ? classes[activeIndex] : null
  const thumbPercent = activeIndex >= 0 && N > 1 ? (activeIndex / (N - 1)) * 100 : null

  function selectIndex(idx: number) {
    const slug = classes[idx].slug as WowClassSlug
    setActive(slug)
    setHoverSlug(slug)
    setActiveSpec(null)
  }

  function handleMouseEnter(slug: WowClassSlug) {
    setHovered(slug)
    if (!active) setHoverSlug(slug)
  }

  function handleMouseLeave() {
    setHovered(null)
    if (!active) setHoverSlug(null)
  }

  function handlePanelMouseLeave() {
    setHovered(null)
    if (!active) setHoverSlug(null)
  }

  function handlePanelClick(slug: WowClassSlug, e: React.MouseEvent) {
    if (active === slug) return
    e.preventDefault()
    setActive(slug)
    setHoverSlug(slug)
    setActiveSpec(null)
  }

  function indexFromPointer(clientX: number): number {
    const rect = sliderRef.current?.getBoundingClientRect()
    if (!rect) return 0
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.min(Math.round(x * (N - 1)), N - 1)
  }

  function handleSliderPointerDown(e: React.PointerEvent) {
    setIsDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    selectIndex(indexFromPointer(e.clientX))
  }

  function handleSliderPointerMove(e: React.PointerEvent) {
    if (!isDragging) return
    selectIndex(indexFromPointer(e.clientX))
  }

  function handleSliderPointerUp() {
    setIsDragging(false)
  }

  function flexGrowForIndex(index: number): number {
    if (activeIndex < 0) return 1
    return flexForDistance(Math.abs(index - activeIndex))
  }

  return {
    active,
    hovered,
    hoveredSpec,
    activeSpec,
    isDragging,
    activeIndex,
    activeClass,
    thumbPercent,
    sliderRef,
    handleMouseEnter,
    handleMouseLeave,
    handlePanelMouseLeave,
    handlePanelClick,
    handleSliderPointerDown,
    handleSliderPointerMove,
    handleSliderPointerUp,
    setHoveredSpec,
    setActiveSpec,
    flexGrowForIndex,
  }
}
