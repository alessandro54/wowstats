import type { WowClassConfig, WowClassSlug } from "./classes/classes-config"
import { WOW_CLASSES } from "./classes/classes-config"

export interface NavMainItem {
  id: number
  title: string
  url: string
  slug: WowClassSlug
  color: string
  iconUrl: string
  items: {
    id: number
    title: string
    url: string
    iconUrl: string
  }[]
}

export type NavMain = NavMainItem[]

export const navMain: NavMain = WOW_CLASSES.map((cls: WowClassConfig) => ({
  id: cls.id,
  title: cls.name,
  slug: cls.slug,
  url: `/pvp/${cls.slug}`,
  iconUrl: cls.iconUrl,
  color: cls.color,
  items: cls.specs.map(spec => ({
    id: spec.id,
    title: spec.name,
    url: spec.url,
    iconUrl: spec.iconUrl,
  })),
}))
