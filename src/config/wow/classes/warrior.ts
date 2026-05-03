import { cdnImage } from "@/config/cdn-config"
import type { SpecAtmosphere, SpecParticleEffect, WowClassConfig } from "./classes-config"

// Class color: #C69B6D
const WarriorConfig: WowClassConfig = {
  id: 1,
  name: "Warrior",
  slug: "warrior",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_warrior.jpg",
  iconRemasteredUrl: cdnImage("/class_media/warrior/class_icon.png", 80),
  specs: [
    {
      id: 71,
      name: "arms",
      url: "/pvp/warrior/arms",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg",
      iconRemasteredUrl: cdnImage("/class_media/warrior/arms_icon.png", 80),
      effect: "ashfire" as SpecParticleEffect,
      atmosphere: "blood" as SpecAtmosphere,
      heroTreeSlugs: [
        "colossus",
        "slayer",
      ],
    },
    {
      id: 72,
      name: "fury",
      url: "/pvp/warrior/fury",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_innerrage.jpg",
      iconRemasteredUrl: cdnImage("/class_media/warrior/fury_icon.png", 80),
      effect: "flames" as SpecParticleEffect,
      atmosphere: "fire" as SpecAtmosphere,
      heroTreeSlugs: [
        "mountainthane",
        "slayer",
      ],
    },
    {
      id: 73,
      name: "protection",
      url: "/pvp/warrior/protection",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_defensivestance.jpg",
      iconRemasteredUrl: cdnImage("/class_media/warrior/protection_icon.png", 80),
      atmosphere: "iron" as SpecAtmosphere,
      heroTreeSlugs: [
        "colossus",
        "mountainthane",
      ],
    },
  ],
  heroTrees: [
    {
      slug: "mountainthane",
      name: "Mountain Thane",
      signatures: [
        "Lightning Strikes",
        "Thorim's Might",
        "Thunder Blast",
      ],
    },
    {
      slug: "slayer",
      name: "Slayer",
      signatures: [
        "Slayer's Dominance",
        "Slayer's Malice",
        "Imminent Demise",
      ],
    },
    {
      slug: "colossus",
      name: "Colossus",
      signatures: [
        "Demolish",
        "Colossal Might",
        "Dominance of the Colossus",
      ],
    },
  ],
}

export default WarriorConfig
