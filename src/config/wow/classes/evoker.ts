import type { SpecAtmosphere, WowClassConfig } from "./classes-config"

// Class color: #33937F
const EvokerConfig: WowClassConfig = {
  id: 13,
  name: "Evoker",
  slug: "evoker",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_evoker.jpg",
  specs: [
    {
      id: 1467,
      name: "devastation",
      url: "/pvp/evoker/devastation",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_evoker_devastation.jpg",
      atmosphere: "fire" as SpecAtmosphere,
    },
    {
      id: 1468,
      name: "preservation",
      url: "/pvp/evoker/preservation",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_evoker_preservation.jpg",
      atmosphere: "mist" as SpecAtmosphere,
    },
    {
      id: 1473,
      name: "augmentation",
      url: "/pvp/evoker/augmentation",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_evoker_augmentation.jpg",
      atmosphere: "arcane" as SpecAtmosphere,
    },
  ],
}

export default EvokerConfig
