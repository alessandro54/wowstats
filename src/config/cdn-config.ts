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

export function iconUrl(url: string | null | undefined, size = 56): string | undefined {
  if (!url) return undefined
  // External URLs (e.g. render.worldofwarcraft.com) load fine in the browser directly.
  // Cloudflare Image Transforms gets 403 fetching from Blizzard's CDN, so skip proxying.
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return proxyImage(url, size)
}
