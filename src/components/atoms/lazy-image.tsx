"use client"

import { useEffect, useRef, useState } from "react"

interface Props {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export function LazyImage({ src, alt, width, height, className = "" }: Props) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Cached images: <img>.complete is true synchronously after mount, so the
  // onLoad event never fires. Without this check the skeleton would flash on
  // every remount (e.g. when switching list filters) even though the bytes
  // are already in the browser cache.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) setLoaded(true)
  }, [
    src,
  ])

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
        ref={imgRef}
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
