import type { WowClassConfig } from "./classes-config"
import { CDN_BASE } from "@/config/cdn-config"

const ShamanConfig: WowClassConfig = {
  id: 7,
  name: "Shaman",
  slug: "shaman",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_shaman.jpg",
  iconRemasteredUrl: `${CDN_BASE}/class_media/shaman/class_icon.png`,
  color: "#0070DE",
  colorOlkch: "oklch(0.5373 0.2243 255.11)",
  specs: [
    {
      id: 262,
      name: "elemental",
      url: "/pvp/shaman/elemental",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_nature_lightning.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/shaman/elemental_icon.png`,
    },
    {
      id: 263,
      name: "enhancement",
      url: "/pvp/shaman/enhancement",
      iconUrl:
        "https://render.worldofwarcraft.com/us/icons/56/spell_shaman_improvedstormstrike.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/shaman/enhancement_icon.png`,
    },
    {
      id: 264,
      name: "restoration",
      url: "/pvp/shaman/restoration",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_nature_magicimmunity.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/shaman/restoration_icon.png`,
    },
  ],
}

export default ShamanConfig
