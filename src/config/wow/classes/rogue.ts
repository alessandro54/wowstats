import type { WowClassConfig } from "./classes-config"
import { cdnImage } from "@/config/cdn-config"

// Class color: #FFF468
const RogueConfig: WowClassConfig = {
  id: 4,
  name: "Rogue",
  slug: "rogue",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_rogue.jpg",
  iconRemasteredUrl: cdnImage("/class_media/rogue/class_icon.png", 80),
  specs: [
    {
      id: 259,
      name: "assassination",
      url: "/pvp/rogue/assassination",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_rogue_deadlybrew.jpg",
      iconRemasteredUrl: cdnImage("/class_media/rogue/assassination_icon.png", 80),
    },
    {
      id: 260,
      name: "outlaw",
      url: "/pvp/rogue/outlaw",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_rogue_waylay.jpg",
      iconRemasteredUrl: cdnImage("/class_media/rogue/outlaw_icon.png", 80),
      effect: "coinrain" as const,
      atmosphere: "warm" as const,
    },
    {
      id: 261,
      name: "subtlety",
      url: "/pvp/rogue/subtlety",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_stealth.jpg",
      iconRemasteredUrl: cdnImage("/class_media/rogue/subtlety_icon.png", 80),
    },
  ],
}

export default RogueConfig
