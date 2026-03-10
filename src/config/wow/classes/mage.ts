import type { WowClassConfig } from "./classes-config"
import { CDN_BASE } from "@/config/cdn-config"

const MageConfig: WowClassConfig = {
  id: 8,
  name: "Mage",
  slug: "mage",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_mage.jpg",
  color: "#69CCF0",
  colorOlkch: "oklch(0.7493 0.2533 249.22)",
  specs: [
    {
      id: 62,
      name: "arcane",
      url: "/pvp/mage/arcane",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_magicalsentry.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/mage/arcane_icon.png`,
    },
    {
      id: 63,
      name: "fire",
      url: "/pvp/mage/fire",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_fire_fireball02.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/mage/fire_icon.png`,
    },
    {
      id: 64,
      name: "frost",
      url: "/pvp/mage/frost",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/mage/frost_icon.png`,
    },
  ],
}

export default MageConfig
