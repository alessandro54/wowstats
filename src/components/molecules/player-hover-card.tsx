"use client"

import { useEffect, useRef, useState } from "react"
import { PlayerHoverFloatingCard } from "@/components/molecules/player-hover-card-content"
import type { CharacterProfile, TopPlayer } from "@/lib/api"

const HOVER_DELAY_MS = 200

const cache = new Map<string, CharacterProfile | "pending" | "missing">()

function cacheKey(p: TopPlayer): string {
  return `${p.region}|${p.realm}|${p.name}`.toLowerCase()
}

interface Props {
  player: TopPlayer
  children: React.ReactNode
  /** Tag to render — defaults to <tr>. */
  as?: "tr" | "div"
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export function PlayerHoverCard({ player, children, as = "tr", className, style, onClick }: Props) {
  const [profile, setProfile] = useState<CharacterProfile | null>(null)
  const [pos, setPos] = useState<{
    x: number
    y: number
  } | null>(null)
  const [pinned, setPinned] = useState(false)
  const touchedRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const loadProfile = () => {
    const key = cacheKey(player)
    const cached = cache.get(key)
    if (cached === "pending" || cached === "missing") return
    if (cached) {
      setProfile(cached)
      return
    }
    cache.set(key, "pending")
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    const qs = new URLSearchParams({
      region: player.region.toLowerCase(),
      realm: player.realm.toLowerCase().replace(/\s+/g, "-"),
      name: player.name.toLowerCase(),
    })
    fetch(`/api/prefetch/character?${qs}`, {
      signal: abortRef.current.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CharacterProfile | null) => {
        if (!data) {
          cache.set(key, "missing")
          return
        }
        cache.set(key, data)
        setProfile(data)
      })
      .catch(() => cache.set(key, "missing"))
  }

  const startHover = (e: React.MouseEvent) => {
    if (touchedRef.current) return
    setPos({
      x: e.clientX,
      y: e.clientY,
    })
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(loadProfile, HOVER_DELAY_MS)
  }
  const moveHover = (e: React.MouseEvent) => {
    if (touchedRef.current) return
    setPos({
      x: e.clientX,
      y: e.clientY,
    })
  }
  const endHover = () => {
    if (touchedRef.current) return
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    abortRef.current?.abort()
    setProfile(null)
    setPos(null)
  }
  const handleTouchStart = (e: React.TouchEvent) => {
    touchedRef.current = true
    const t = e.touches[0]
    if (!t) return
    setPos({
      x: t.clientX,
      y: t.clientY,
    })
  }
  const handleClick = () => {
    if (touchedRef.current && !pinned) {
      setPinned(true)
      loadProfile()
      return
    }
    setPinned(false)
    onClick?.()
  }

  useEffect(() => {
    if (!pinned) return
    const close = (e: Event) => {
      const node = (e.target as HTMLElement | null)?.closest("[data-player-card]")
      if (node) return
      setPinned(false)
      setProfile(null)
      setPos(null)
    }
    document.addEventListener("touchstart", close)
    document.addEventListener("mousedown", close)
    return () => {
      document.removeEventListener("touchstart", close)
      document.removeEventListener("mousedown", close)
    }
  }, [
    pinned,
  ])

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      abortRef.current?.abort()
    },
    [],
  )

  const handlers = {
    onMouseEnter: startHover,
    onMouseMove: moveHover,
    onMouseLeave: endHover,
    onTouchStart: handleTouchStart,
    onClick: handleClick,
    className,
    style,
    "data-player-card": "",
  }

  return (
    <>
      {as === "tr" ? <tr {...handlers}>{children}</tr> : <div {...handlers}>{children}</div>}
      {profile && pos && (
        <PlayerHoverFloatingCard profile={profile} x={pos.x} y={pos.y} interactive={pinned} />
      )}
    </>
  )
}
