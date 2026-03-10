import { CDN_BASE } from "@/config/cdn-config"
import type { WowClassConfig } from "./classes-config"

// Class color: #C69B6D
const WarriorConfig: WowClassConfig = {
  id: 1,
  name: "Warrior",
  slug: "warrior",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_warrior.jpg",
  iconRemasteredUrl: `${CDN_BASE}/class_media/warrior/class_icon.png`,
  specs: [
    {
      id: 71,
      name: "arms",
      url: "/pvp/warrior/arms",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/warrior/arms_icon.png`,
    },
    {
      id: 72,
      name: "fury",
      url: "/pvp/warrior/fury",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_innerrage.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/warrior/fury_icon.png`,
    },
    {
      id: 73,
      name: "protection",
      url: "/pvp/warrior/protection",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_defensivestance.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/warrior/protection_icon.png`,
    },
  ],
}

export default WarriorConfig
