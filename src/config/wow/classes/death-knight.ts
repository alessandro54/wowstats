import { CDN_BASE, cdnImage } from "@/config/cdn-config"
import type { SpecAtmosphere, SpecParticleEffect, WowClassConfig } from "./classes-config"

// Class color: #C41E3A
const DeathKnightConfig: WowClassConfig = {
  id: 6,
  name: "Death Knight",
  slug: "death-knight",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_deathknight_classicon.jpg",
  iconRemasteredUrl: cdnImage("/class_media/death-knight/class_icon.png", 80),
  bannerUrl: `${CDN_BASE}/class_media/death-knight/class_banner.png`,
  specs: [
    {
      id: 251,
      name: "frost",
      url: "/pvp/death-knight/frost",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_deathknight_frostpresence.jpg",
      iconRemasteredUrl: cdnImage("/class_media/death-knight/frost_icon.png", 80),
      splash: {
        url: `${CDN_BASE}/class_media/death-knight/frost_splash.png`,
        position: "right 20%",
      },
      animationUrl: `${CDN_BASE}/class_media/death-knight/frost_animation.mp4`,
      effect: "snow" as SpecParticleEffect,
      atmosphere: "frost" as SpecAtmosphere,
    },
    {
      id: 252,
      name: "unholy",
      url: "/pvp/death-knight/unholy",
      iconUrl:
        "https://render.worldofwarcraft.com/us/icons/56/spell_deathknight_unholypresence.jpg",
      iconRemasteredUrl: cdnImage("/class_media/death-knight/unholy_icon.png", 80),
      splash: {
        url: `${CDN_BASE}/class_media/death-knight/unholy_splash.png`,
      },
      animationUrl: `${CDN_BASE}/class_media/death-knight/unholy_animation.mp4`,
      effect: "plague" as SpecParticleEffect,
      atmosphere: "toxic" as SpecAtmosphere,
    },
    {
      id: 250,
      name: "blood",
      url: "/pvp/death-knight/blood",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_deathknight_bloodpresence.jpg",
      iconRemasteredUrl: cdnImage("/class_media/death-knight/blood_icon.png", 80),
      splash: {
        url: `${CDN_BASE}/class_media/death-knight/blood_splash.png`,
        position: "80% top",
      },
      animationUrl: `${CDN_BASE}/class_media/death-knight/blood_animation.mp4`,
      effect: "blood" as SpecParticleEffect,
      atmosphere: "blood" as SpecAtmosphere,
    },
  ],
}

export default DeathKnightConfig
