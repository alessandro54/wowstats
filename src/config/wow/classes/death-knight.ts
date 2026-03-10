import { CDN_BASE } from "@/config/cdn-config"
import type { WowClassConfig } from "./classes-config"

// Class color: #C41E3A
const DeathKnightConfig: WowClassConfig = {
  id: 6,
  name: "Death Knight",
  slug: "death-knight",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_deathknight_classicon.jpg",
  iconRemasteredUrl: `${CDN_BASE}/class_media/death-knight/class_icon.png`,
  bannerUrl: `${CDN_BASE}/class_media/death-knight/class_banner.png`,
  specs: [
    {
      id: 251,
      name: "frost",
      url: "/pvp/death-knight/frost",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_deathknight_frostpresence.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/death-knight/frost_icon.png`,
      splash: {
        url: `${CDN_BASE}/class_media/death-knight/frost_splash.png`,
        position: "100% center",
      },
      animationUrl: `${CDN_BASE}/class_media/death-knight/frost_animation.mp4`,
    },
    {
      id: 252,
      name: "unholy",
      url: "/pvp/death-knight/unholy",
      iconUrl:
        "https://render.worldofwarcraft.com/us/icons/56/spell_deathknight_unholypresence.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/death-knight/unholy_icon.png`,
      splash: {
        url: `${CDN_BASE}/class_media/death-knight/unholy_splash.png`,
      },
      animationUrl: `${CDN_BASE}/class_media/death-knight/unholy_animation.mp4`,
    },
    {
      id: 250,
      name: "blood",
      url: "/pvp/death-knight/blood",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_deathknight_bloodpresence.jpg",
      iconRemasteredUrl: `${CDN_BASE}/class_media/death-knight/blood_icon.png`,
      splash: {
        url: `${CDN_BASE}/class_media/death-knight/blood_splash.png`,
        position: "80% center",
      },
      animationUrl: `${CDN_BASE}/class_media/death-knight/blood_animation.mp4`,
    },
  ],
}

export default DeathKnightConfig
