import { cdnImage } from "@/config/cdn-config"
import type { SpecAtmosphere, WowClassConfig } from "./classes-config"

// Class color: #AAD372
const HunterConfig: WowClassConfig = {
  id: 3,
  name: "Hunter",
  slug: "hunter",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_hunter.jpg",
  iconRemasteredUrl: cdnImage("/class_media/hunter/class_icon.png", 80),
  specs: [
    {
      id: 253,
      name: "beast-mastery",
      url: "/pvp/hunter/beast-mastery",
      iconUrl:
        "https://render.worldofwarcraft.com/us/icons/56/ability_hunter_bestialdiscipline.jpg",
      iconRemasteredUrl: cdnImage("/class_media/hunter/beastmastery_icon.png", 80),
      atmosphere: "nature" as SpecAtmosphere,
      heroTreeSlugs: [
        "packleader",
        "darkranger",
      ],
    },
    {
      id: 254,
      name: "marksmanship",
      url: "/pvp/hunter/marksmanship",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_hunter_focusedaim.jpg",
      iconRemasteredUrl: cdnImage("/class_media/hunter/marksmanship_icon.png", 80),
      atmosphere: "iron" as SpecAtmosphere,
      heroTreeSlugs: [
        "darkranger",
        "sentinel",
      ],
    },
    {
      id: 255,
      name: "survival",
      url: "/pvp/hunter/survival",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_hunter_camouflage.jpg",
      iconRemasteredUrl: cdnImage("/class_media/hunter/survival_icon.png", 80),
      atmosphere: "nature" as SpecAtmosphere,
      heroTreeSlugs: [
        "packleader",
        "sentinel",
      ],
    },
  ],
  heroTrees: [
    {
      slug: "packleader",
      name: "Pack Leader",
      signatures: [
        "Howl of the Pack Leader",
        "Pack Mentality",
        "Hoof and Blade",
      ],
    },
    {
      slug: "sentinel",
      name: "Sentinel",
      signatures: [
        "Sentinel",
        "Lunar Storm",
      ],
    },
    {
      slug: "darkranger",
      name: "Dark Ranger",
      signatures: [
        "Black Arrow",
        "Smoke Screen",
        "Bleak Arrows",
      ],
    },
  ],
}

export default HunterConfig
