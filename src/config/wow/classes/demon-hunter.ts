import type { WowClassConfig } from "./classes-config"
import { CDN_BASE } from "@/config/cdn-config"

const DemonHunterConfig: WowClassConfig = {
  id: 12,
  name: "Demon Hunter",
  slug: "demon-hunter",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_demonhunter.jpg",
  iconRemasteredUrl: `${CDN_BASE}/class_media/demon-hunter/class_icon.png`,
  color: "#A330C9",
  colorOlkch: "oklch(0.4502 0.2343 306.19)",
  specs: [
    {
      id: 577,
      name: "havoc",
      url: "/pvp/demon-hunter/havoc",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_demonhunter_specdps.jpg",
    },
    {
      id: 581,
      name: "vengeance",
      url: "/pvp/demon-hunter/vengeance",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_demonhunter_spectank.jpg",
    },
    {
      id: 1480,
      name: "devourer",
      url: "/pvp/demon-hunter/devourer",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_demonhunter_void.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/demon-hunter/devourer_icon.png`,
    },
  ],
}

export default DemonHunterConfig
