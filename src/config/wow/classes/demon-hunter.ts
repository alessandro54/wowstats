import { cdnImage } from "@/config/cdn-config"
import type { SpecAtmosphere, SpecParticleEffect, WowClassConfig } from "./classes-config"

// Class color: #A330C9
const DemonHunterConfig: WowClassConfig = {
  id: 12,
  name: "Demon Hunter",
  slug: "demon-hunter",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_demonhunter.jpg",
  iconRemasteredUrl: cdnImage("/class_media/demon-hunter/class_icon.png", 80),
  specs: [
    {
      id: 577,
      name: "havoc",
      url: "/pvp/demon-hunter/havoc",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_demonhunter_specdps.jpg",
      effect: "felfire" as SpecParticleEffect,
      atmosphere: "fel" as SpecAtmosphere,
      heroTreeSlugs: [
        "aldrachireaver",
        "felscarred",
      ],
    },
    {
      id: 581,
      name: "vengeance",
      url: "/pvp/demon-hunter/vengeance",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_demonhunter_spectank.jpg",
      atmosphere: "fire" as SpecAtmosphere,
      heroTreeSlugs: [
        "aldrachireaver",
        "felscarred",
      ],
    },
    {
      id: 1480,
      name: "devourer",
      url: "/pvp/demon-hunter/devourer",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_demonhunter_void.jpg",
      iconRemasteredUrl: cdnImage("/class_media/demon-hunter/devourer_icon.png", 80),
      effect: "voidfire" as SpecParticleEffect,
      atmosphere: "shadow" as SpecAtmosphere,
      heroTreeSlugs: [
        "aldrachireaver",
        "felscarred",
      ],
    },
  ],
  heroTrees: [
    {
      slug: "aldrachireaver",
      name: "Aldrachi Reaver",
      signatures: [
        "Art of the Glaive",
        "Aldrachi Tactics",
        "Fury of the Aldrachi",
      ],
    },
    {
      slug: "felscarred",
      name: "Fel-scarred",
      signatures: [
        "Demonsurge",
        "Enduring Torment",
      ],
    },
  ],
}

export default DemonHunterConfig
