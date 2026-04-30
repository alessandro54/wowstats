"use client"

import { useLayoutEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    document.querySelector("[data-scroll-container]")?.scrollTo({
      top: 0,
      behavior: "instant",
    })
  }, [
    pathname,
  ])

  return null
}
