import { CDN_BASE, cdnImage } from "@/config/cdn-config"
import type { SpecAtmosphere, SpecParticleEffect, WowClassConfig } from "./classes-config"

// Class color: #9482C9
const WarlockConfig: WowClassConfig = {
  id: 9,
  name: "Warlock",
  slug: "warlock",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_warlock.jpg",
  iconRemasteredUrl: cdnImage("/class_media/warlock/class_icon.png", 80),
  bannerUrl: `${CDN_BASE}/class_media/warlock/class_banner.png`,
  specs: [
    {
      id: 265,
      name: "affliction",
      url: "/pvp/warlock/affliction",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_shadow_deathcoil.jpg",
      iconRemasteredUrl: cdnImage("/class_media/warlock/affliction_icon.png", 80),
      animationUrl: `${CDN_BASE}/class_media/warlock/affliction_animation.mp4`,
      effect: "venomdrip" as const,
      atmosphere: "shadow" as SpecAtmosphere,
    },
    {
      id: 266,
      name: "demonology",
      url: "/pvp/warlock/demonology",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_shadow_metamorphosis.jpg",
      iconRemasteredUrl: cdnImage("/class_media/warlock/demonology_icon.png", 80),
      animationUrl: `${CDN_BASE}/class_media/warlock/demonology_animation.mp4`,
      atmosphere: "fel" as SpecAtmosphere,
    },
    {
      id: 267,
      name: "destruction",
      url: "/pvp/warlock/destruction",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_shadow_rainoffire.jpg",
      iconRemasteredUrl: cdnImage("/class_media/warlock/destruction_icon.png", 80),
      animationUrl: `${CDN_BASE}/class_media/warlock/destruction_animation.mp4`,
      effect: "rainoffire" as SpecParticleEffect,
      atmosphere: "fire" as SpecAtmosphere,
    },
  ],
}

export default WarlockConfig
