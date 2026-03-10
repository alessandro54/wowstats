import type { WowClassConfig } from "./classes-config"

// Class color: #F58CBA
const PaladinConfig: WowClassConfig = {
  id: 2,
  name: "Paladin",
  slug: "paladin",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_paladin.jpg",
  specs: [
    {
      id: 65,
      name: "holy",
      url: "/pvp/paladin/holy",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_holybolt.jpg",
    },
    {
      id: 66,
      name: "protection",
      url: "/pvp/paladin/protection",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_devotionaura.jpg",
    },
    {
      id: 70,
      name: "retribution",
      url: "/pvp/paladin/retribution",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_auraoflight.jpg",
    },
  ],
}

export default PaladinConfig
