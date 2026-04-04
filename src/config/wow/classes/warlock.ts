import type { WowClassConfig, SpecEffect } from "./classes-config"
import { CDN_BASE } from "@/config/cdn-config"

// Class color: #9482C9
const WarlockConfig: WowClassConfig = {
  id: 9,
  name: "Warlock",
  slug: "warlock",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_warlock.jpg",
  iconRemasteredUrl: `${CDN_BASE}/class_media/warlock/class_icon.png`,
  bannerUrl: `${CDN_BASE}/class_media/warlock/class_banner.png`,
  specs: [
    {
      id: 265,
      name: "affliction",
      url: "/pvp/warlock/affliction",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_shadow_deathcoil.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/warlock/affliction_icon.png`,
      animationUrl: `${CDN_BASE}/class_media/warlock/affliction_animation.mp4`,
    },
    {
      id: 266,
      name: "demonology",
      url: "/pvp/warlock/demonology",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_shadow_metamorphosis.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/warlock/demonology_icon.png`,
      animationUrl: `${CDN_BASE}/class_media/warlock/demonology_animation.mp4`,
    },
    {
      id: 267,
      name: "destruction",
      url: "/pvp/warlock/destruction",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_shadow_rainoffire.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/warlock/destruction_icon.png`,
      animationUrl: `${CDN_BASE}/class_media/warlock/destruction_animation.mp4`,
      effect: "rainoffire" as SpecEffect,
    },
  ],
}

export default WarlockConfig
