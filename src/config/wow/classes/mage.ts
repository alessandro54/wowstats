import { cdnImage } from "@/config/cdn-config"
import type { WowClassConfig } from "./classes-config"

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
    },
    {
      id: 63,
      name: "fire",
      url: "/pvp/mage/fire",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_fire_fireball02.jpg",
      iconRemasteredUrl: cdnImage("/class_media/mage/fire_icon.png", 80),
    },
    {
      id: 64,
      name: "frost",
      url: "/pvp/mage/frost",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg",
      iconRemasteredUrl: cdnImage("/class_media/mage/frost_icon.png", 80),
    },
  ],
}

export default MageConfig
