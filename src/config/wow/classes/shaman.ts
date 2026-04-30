import { cdnImage } from "@/config/cdn-config"
import type { SpecAtmosphere, SpecParticleEffect, WowClassConfig } from "./classes-config"

// Class color: #0070DE
const ShamanConfig: WowClassConfig = {
  id: 7,
  name: "Shaman",
  slug: "shaman",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_shaman.jpg",
  iconRemasteredUrl: cdnImage("/class_media/shaman/class_icon.png", 80),
  specs: [
    {
      id: 262,
      name: "elemental",
      url: "/pvp/shaman/elemental",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_nature_lightning.jpg",
      iconRemasteredUrl: cdnImage("/class_media/shaman/elemental_icon.png", 80),
      effect: "lightning" as SpecParticleEffect,
      atmosphere: "storm" as SpecAtmosphere,
    },
    {
      id: 263,
      name: "enhancement",
      url: "/pvp/shaman/enhancement",
      iconUrl:
        "https://render.worldofwarcraft.com/us/icons/56/spell_shaman_improvedstormstrike.jpg",
      iconRemasteredUrl: cdnImage("/class_media/shaman/enhancement_icon.png", 80),
      effect: "lightning" as SpecParticleEffect,
      atmosphere: "storm" as SpecAtmosphere,
    },
    {
      id: 264,
      name: "restoration",
      url: "/pvp/shaman/restoration",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_nature_magicimmunity.jpg",
      iconRemasteredUrl: cdnImage("/class_media/shaman/restoration_icon.png", 80),
      effect: "waterrain" as SpecParticleEffect,
      atmosphere: "nature" as SpecAtmosphere,
    },
  ],
}

export default ShamanConfig
