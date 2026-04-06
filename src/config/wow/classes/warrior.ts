import { cdnImage } from "@/config/cdn-config"
import type { WowClassConfig } from "./classes-config"

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
    },
    {
      id: 72,
      name: "fury",
      url: "/pvp/warrior/fury",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_innerrage.jpg",
      iconRemasteredUrl: cdnImage("/class_media/warrior/fury_icon.png", 80),
    },
    {
      id: 73,
      name: "protection",
      url: "/pvp/warrior/protection",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_defensivestance.jpg",
      iconRemasteredUrl: cdnImage("/class_media/warrior/protection_icon.png", 80),
    },
  ],
}

export default WarriorConfig
