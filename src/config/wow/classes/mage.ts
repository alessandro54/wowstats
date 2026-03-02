import { CDN_BASE } from "@/config/cdn"
import { WowClassConfig } from "."

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
      url: "/mage/arcane",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_nature_starfall.jpg",
      iconRemasteredUrl: `${CDN_BASE}/icons-remastered/mage_arcane.png`,
    },
    {
      id: 63,
      name: "fire",
      url: "/mage/fire",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_fire_fireball02.jpg",
      iconRemasteredUrl: `${CDN_BASE}/icons-remastered/mage_fire.png`,
    },
    {
      id: 64,
      name: "frost",
      url: "/mage/frost",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg",
      iconRemasteredUrl: `${CDN_BASE}/icons-remastered/mage_frost.png`,
    },
  ],
}

export default MageConfig
