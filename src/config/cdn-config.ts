export const CDN_BASE = "https://cdn.wowstats.gg"

export function cdnImage(path: string, width: number): string {
  const w = width * 2
  return `${CDN_BASE}/cdn-cgi/image/width=${w},format=auto,quality=85${path}`
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
