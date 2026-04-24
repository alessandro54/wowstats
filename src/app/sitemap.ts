import type { MetadataRoute } from "next"
import { BRACKETS } from "@/config/wow/brackets-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wowstats.gg"
const META_ROLES = [
  "dps",
  "healer",
  "tank",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  entries.push({
    url: SITE_URL,
    lastModified: now,
    changeFrequency: "hourly",
    priority: 1.0,
  })

  for (const bracket of BRACKETS) {
    for (const role of META_ROLES) {
      entries.push({
        url: `${SITE_URL}/pvp/meta/${bracket.slug}/${role}`,
        lastModified: now,
        changeFrequency: "hourly",
        priority: 0.9,
      })
    }
  }

  for (const cls of WOW_CLASSES) {
    for (const spec of cls.specs) {
      for (const bracket of BRACKETS) {
        entries.push({
          url: `${SITE_URL}/pvp/${cls.slug}/${spec.name}/${bracket.slug}`,
          lastModified: now,
          changeFrequency: "hourly",
          priority: 0.8,
        })
      }
    }
  }

  return entries
}
