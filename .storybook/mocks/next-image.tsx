/* eslint-disable @next/next/no-img-element */
import type { ImgHTMLAttributes } from "react";

type NextImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | { src: string };
};

export default function Image({ src, alt = "", ...props }: NextImageProps) {
  const resolvedSrc = typeof src === "string" ? src : src.src;
  return <img src={resolvedSrc} alt={alt} {...props} />;
}
