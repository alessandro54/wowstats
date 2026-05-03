import { cdnImage } from "@/config/cdn-config"
import type { SpecAtmosphere, SpecParticleEffect, WowClassConfig } from "./classes-config"

// Class color: #69CCF0
const MageConfig: WowClassConfig = {
  id: 8,
  name: "Mage",
  slug: "mage",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_mage.jpg",
  specs: [
    {
      id: 62,
      name: "arcane",
      url: "/pvp/mage/arcane",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_magicalsentry.jpg",
      iconRemasteredUrl: cdnImage("/class_media/mage/arcane_icon.png", 80),
      effect: "arcaneorbs" as SpecParticleEffect,
      atmosphere: "arcane" as SpecAtmosphere,
      heroTreeSlugs: [
        "spellslinger",
        "sunfury",
      ],
    },
    {
      id: 63,
      name: "fire",
      url: "/pvp/mage/fire",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_fire_fireball02.jpg",
      iconRemasteredUrl: cdnImage("/class_media/mage/fire_icon.png", 80),
      effect: "rainoffire" as SpecParticleEffect,
      atmosphere: "fire" as SpecAtmosphere,
      heroTreeSlugs: [
        "frostfire",
        "sunfury",
      ],
    },
    {
      id: 64,
      name: "frost",
      url: "/pvp/mage/frost",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg",
      iconRemasteredUrl: cdnImage("/class_media/mage/frost_icon.png", 80),
      effect: "rainoffrost" as SpecParticleEffect,
      atmosphere: "frost" as SpecAtmosphere,
      heroTreeSlugs: [
        "frostfire",
        "spellslinger",
      ],
    },
  ],
  heroTrees: [
    {
      slug: "frostfire",
      name: "Frostfire",
      signatures: [
        "Frostfire Empowerment",
        "Frostfire Bolt",
        "Frostfire Infusion",
      ],
    },
    {
      slug: "spellslinger",
      name: "Spellslinger",
      signatures: [
        "Splinterstorm",
        "Splintering Sorcery",
      ],
    },
    {
      slug: "sunfury",
      name: "Sunfury",
      signatures: [
        "Spellfire Spheres",
        "Memory of Al'ar",
      ],
    },
  ],
}

export default MageConfig
