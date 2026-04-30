import type { SpecAtmosphere, SpecParticleEffect, WowClassConfig } from "./classes-config"

// Class color: #FFFFFF
const PriestConfig: WowClassConfig = {
  id: 5,
  name: "Priest",
  slug: "priest",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_priest.jpg",
  specs: [
    {
      id: 256,
      name: "discipline",
      url: "/pvp/priest/discipline",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_powerwordshield.jpg",
      atmosphere: "holy" as SpecAtmosphere,
    },
    {
      id: 257,
      name: "holy",
      url: "/pvp/priest/holy",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_guardianspirit.jpg",
      effect: "holylight" as SpecParticleEffect,
      atmosphere: "holy" as SpecAtmosphere,
    },
    {
      id: 258,
      name: "shadow",
      url: "/pvp/priest/shadow",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_shadow_shadowwordpain.jpg",
      effect: "shadowsmoke" as SpecParticleEffect,
      atmosphere: "shadow" as SpecAtmosphere,
    },
  ],
}

export default PriestConfig
