"use client"

import { useState } from "react"

interface Props {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export function LazyImage({ src, alt, width, height, className = "" }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <span
      className={`relative inline-block overflow-hidden ${className}`}
      style={{
        width,
        height,
      }}
    >
      {!loaded && <span className="absolute inset-0 animate-pulse rounded-[inherit] bg-muted" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`block h-full w-full rounded-[inherit] object-cover transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  )
}
