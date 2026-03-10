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

export type WowClassSlug
  = | "death-knight"
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

export type WowClassSpecSlug
  = | "frost"
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

export interface WowClassSpec {
  id: number
  name: WowClassSpecSlug
  url: string
  iconUrl: string
  iconRemasteredUrl?: string
  splash?: { url: string , position?: string } // position is CSS object-position, e.g. "80% center" or "right top"
  splashPosition?: string // CSS object-position, e.g. "80% center" or "right top"
  animationUrl?: string
  colorOlkch?: string
}

export interface WowClassConfig {
  id: number
  name: string
  slug: WowClassSlug
  iconUrl: string
  iconRemasteredUrl?: string
  bannerUrl?: string
  color: string
  colorOlkch: string
  bgGradient?: string
  specs: WowClassSpec[]
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
