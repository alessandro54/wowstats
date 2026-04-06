export const CDN_BASE =
  process.env.NEXT_PUBLIC_CDN_URL ?? "https://pub-627f5a049a2d470c85b1b70cbd99a5ce.r2.dev"

const CDN_ORIGIN = "https://pub-627f5a049a2d470c85b1b70cbd99a5ce.r2.dev"
const CDN_TRANSFORM = "https://cdn.wowinsights.xyz"

/**
 * Returns a Cloudflare Image Transform URL that auto-resizes and converts to AVIF/WebP.
 * @param path - path relative to CDN root, e.g. "/class_media/warrior/class_icon.png"
 * @param width - desired display width in CSS pixels (doubled for retina)
 */
export function cdnImage(path: string, width: number): string {
  const w = width * 2 // retina
  return `${CDN_TRANSFORM}/cdn-cgi/image/width=${w},format=auto,quality=85/${CDN_ORIGIN}${path}`
}
