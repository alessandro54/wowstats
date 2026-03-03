import type { WowClassConfig } from "./classes-config"

const CDN = "https://pub-627f5a049a2d470c85b1b70cbd99a5ce.r2.dev"

const DeathKnightConfig: WowClassConfig = {
  id: 6,
  name: "Death Knight",
  slug: "death-knight",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_deathknight_classicon.jpg",
  color: "#C41E3A",
  colorOlkch: "oklch(0.5308 0.1969 19.54)",
  specs: [
    {
      id: 251,
      name: "frost",
      url: "/death-knight/frost",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_deathknight_frostpresence.jpg",
      iconRemasteredUrl: `${CDN}/icons-remastered/deathknight_frost.png`,
      animationUrl: `${CDN}/animations/deathknight_frost.mp4`,
    },
    {
      id: 252,
      name: "unholy",
      url: "/death-knight/unholy",
      iconUrl:
        "https://render.worldofwarcraft.com/us/icons/56/spell_deathknight_unholypresence.jpg",
      iconRemasteredUrl: `${CDN}/icons-remastered/deathknight_unholy.png`,
      animationUrl: `${CDN}/animations/deathknight_unholy.mp4`,
    },
    {
      id: 250,
      name: "blood",
      url: "/death-knight/blood",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_deathknight_bloodpresence.jpg",
      iconRemasteredUrl: `${CDN}/icons-remastered/deathknight_blood.png`,
      animationUrl: `${CDN}/animations/deathknight_blood.mp4`,
    },
  ],
}

export default DeathKnightConfig
