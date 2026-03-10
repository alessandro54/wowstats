import type { WowClassConfig } from "./classes-config"
import { CDN_BASE } from "@/config/cdn-config"

const RogueConfig: WowClassConfig = {
  id: 4,
  name: "Rogue",
  slug: "rogue",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_rogue.jpg",
  iconRemasteredUrl: `${CDN_BASE}/class_media/rogue/class_icon.png`,
  color: "#FFF468",
  colorOlkch: "oklch(0.8471 0.2243 91.37)",
  specs: [
    {
      id: 259,
      name: "assassination",
      url: "/pvp/rogue/assassination",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_rogue_deadlybrew.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/rogue/assassination_icon.png`,
    },
    {
      id: 260,
      name: "outlaw",
      url: "/pvp/rogue/outlaw",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_rogue_waylay.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/rogue/outlaw_icon.png`,
    },
    {
      id: 261,
      name: "subtlety",
      url: "/pvp/rogue/subtlety",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_rogue_shadowdance.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/rogue/subtlety_icon.png`,
    },
  ],
}

export default RogueConfig
