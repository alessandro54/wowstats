import type { WowClassConfig } from "./classes-config"
import { CDN_BASE } from "@/config/cdn-config"

const HunterConfig: WowClassConfig = {
  id: 3,
  name: "Hunter",
  slug: "hunter",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_hunter.jpg",
  color: "#AAD372",
  colorOlkch: "oklch(0.7843 0.1373 125.11)",
  specs: [
    {
      id: 253,
      name: "beast-mastery",
      url: "/pvp/hunter/beast-mastery",
      iconUrl:
        "https://render.worldofwarcraft.com/us/icons/56/ability_hunter_bestialdiscipline.jpg",
      iconRemasteredUrl: `${CDN_BASE}/icons-remastered/hunter_beastmastery.png`,
    },
    {
      id: 254,
      name: "marksmanship",
      url: "/pvp/hunter/marksmanship",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_hunter_focusedaim.jpg",
      iconRemasteredUrl: `${CDN_BASE}/icons-remastered/hunter_marksmanship.png`,
    },
    {
      id: 255,
      name: "survival",
      url: "/pvp/hunter/survival",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_hunter_camouflage.jpg",
      iconRemasteredUrl: `${CDN_BASE}/icons-remastered/hunter_survival.png`,
    },
  ],
}

export default HunterConfig
