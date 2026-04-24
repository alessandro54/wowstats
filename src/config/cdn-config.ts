/** Custom domain — used for direct asset URLs (banners, animations, splash art) */
export const CDN_BASE = "https://cdn.wowstats.gg"

/** R2 public endpoint — used as the source for Cloudflare Image Transforms
 *  (transforms can't fetch from the same domain they run on). */
const CDN_ORIGIN = "https://pub-627f5a049a2d470c85b1b70cbd99a5ce.r2.dev"

/**
 * Returns a Cloudflare Image Transform URL that auto-resizes and converts to AVIF/WebP.
 * @param path - path relative to CDN root, e.g. "/class_media/warrior/class_icon.png"
 * @param width - desired display width in CSS pixels (doubled for retina)
 */
export function cdnImage(path: string, width: number): string {
  const w = width * 2
  return `${CDN_BASE}/cdn-cgi/image/width=${w},format=auto,quality=85/${CDN_ORIGIN}${path}`
}

/**
 * Proxies an external image URL through Cloudflare Image Transforms.
 * Adds caching, auto-resize, and AVIF/WebP conversion.
 * Works with any public URL (e.g., render.worldofwarcraft.com).
 */
export function proxyImage(url: string, width: number): string {
  const w = width * 2
  return `${CDN_BASE}/cdn-cgi/image/width=${w},format=auto,quality=85/${url}`
}
