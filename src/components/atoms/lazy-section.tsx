"use client"

import { useEffect, useRef, useState } from "react"

interface Props {
  children: React.ReactNode
  className?: string
  /** Margin around the root for triggering early (e.g. "200px") */
  rootMargin?: string
}

export function LazySection({ children, className, rootMargin = "200px" }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      {
        rootMargin,
      },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [
    rootMargin,
  ])

  return (
    <div ref={ref} className={className}>
      {visible ? children : null}
    </div>
  )
}
