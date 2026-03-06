import type { WowClassConfig } from "./classes-config"

const PriestConfig: WowClassConfig = {
  id: 5,
  name: "Priest",
  slug: "priest",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_priest.jpg",
  color: "#FFFFFF",
  colorOlkch: "oklch(0.9275 0.0 0.0)",
  specs: [
    {
      id: 256,
      name: "discipline",
      url: "/pvp/priest/discipline",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_powerwordshield.jpg",
    },
    {
      id: 257,
      name: "holy",
      url: "/pvp/priest/holy",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_guardianspirit.jpg",
    },
    {
      id: 258,
      name: "shadow",
      url: "/pvp/priest/shadow",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_shadow_shadowwordpain.jpg",
    },
  ],
}

export default PriestConfig
