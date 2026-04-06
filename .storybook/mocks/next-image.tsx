/* eslint-disable next/no-img-element */
import type { ImgHTMLAttributes } from "react"

type NextImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src:
    | string
    | {
        src: string
      }
  unoptimized?: boolean
  priority?: boolean
  quality?: number | string
  fill?: boolean
  sizes?: string
  loader?: (props: { src: string; width: number; quality?: number }) => string
}

export default function Image({
  src,
  alt = "",
  unoptimized: _unoptimized,
  priority: _priority,
  quality: _quality,
  fill: _fill,
  sizes: _sizes,
  loader: _loader,
  ...props
}: NextImageProps) {
  const resolvedSrc = typeof src === "string" ? src : src.src
  return <img src={resolvedSrc} alt={alt} {...props} />
}
