import HunterConfig from "@/config/wow/classes/hunter"
import MonkConfig from "@/config/wow/classes/monk"
import ShamanConfig from "@/config/wow/classes/shaman"
import WarlockConfig from "@/config/wow/classes/warlock"
import DeathKnightConfig from "./death-knight"
import DemonHunterConfig from "./demon-hunter"
import DruidConfig from "./druid"
import EvokerConfig from "./evoker"
import MageConfig from "./mage"
import PaladinConfig from "./paladin"
import PriestConfig from "./priest"
import RogueConfig from "./rogue"
import WarriorConfig from "./warrior"

export type WowClassSlug =
  | "death-knight"
  | "demon-hunter"
  | "druid"
  | "hunter"
  | "mage"
  | "monk"
  | "paladin"
  | "priest"
  | "rogue"
  | "shaman"
  | "warlock"
  | "warrior"
  | "evoker"

export type WowClassSpecSlug =
  | "frost"
  | "unholy"
  | "blood"
  | "havoc"
  | "vengeance"
  | "devourer"
  | "balance"
  | "feral"
  | "guardian"
  | "restoration"
  | "beast-mastery"
  | "marksmanship"
  | "survival"
  | "arcane"
  | "fire"
  | "frost"
  | "windwalker"
  | "mistweaver"
  | "brewmaster"
  | "holy"
  | "protection"
  | "retribution"
  | "discipline"
  | "holy"
  | "shadow"
  | "assassination"
  | "outlaw"
  | "subtlety"
  | "elemental"
  | "enhancement"
  | "restoration"
  | "affliction"
  | "demonology"
  | "destruction"
  | "arms"
  | "fury"
  | "protection"
  | "devastation"
  | "preservation"
  | "augmentation"

export type SpecParticleEffect =
  | "snow"
  | "plague"
  | "blood"
  | "rainoffire"
  | "coinrain"
  | "shadowsmoke"
  | "venomdrip"
  | "flames"
  | "lightning"
  | "waterrain"
  | "rainoffrost"
  | "felfire"
  | "voidfire"
  | "rainofstars"
  | "arcaneorbs"
  | "holylight"
  | "ashfire"
  | "holyfire"

export type SpecAtmosphere =
  | "frost"
  | "toxic"
  | "blood"
  | "fire"
  | "warm"
  | "holy"
  | "shadow"
  | "fel"
  | "nature"
  | "storm"
  | "arcane"
  | "iron"
  | "mist"
  | "lunar"

export interface WowClassSpec {
  id: number
  name: WowClassSpecSlug
  url: string
  iconUrl: string
  iconRemasteredUrl?: string
  splash?: {
    url: string
    position?: string // CSS object-position
  }
  splashPosition?: string // CSS object-position
  animationUrl?: string
  effect?: SpecParticleEffect
  atmosphere?: SpecAtmosphere
  // Hero trees this spec can choose between (2 of the class's 3, except DH).
  heroTreeSlugs?: string[]
}

export interface HeroTreeConfig {
  slug: string // suffix in the atlas filename
  name: string // display label
  signatures: string[] // any matching talent name picks this tree
}

export interface WowClassConfig {
  id: number
  name: string
  slug: WowClassSlug
  iconUrl: string
  iconRemasteredUrl?: string
  bannerUrl?: string
  bgGradient?: string
  specs: WowClassSpec[]
  heroTrees?: HeroTreeConfig[]
}

export const WOW_CLASSES: WowClassConfig[] = [
  DeathKnightConfig,
  DemonHunterConfig,
  DruidConfig,
  EvokerConfig,
  HunterConfig,
  MageConfig,
  MonkConfig,
  PaladinConfig,
  PriestConfig,
  RogueConfig,
  ShamanConfig,
  WarlockConfig,
  WarriorConfig,
]
