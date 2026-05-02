import type { SpecAtmosphere, SpecParticleEffect, WowClassConfig } from "./classes-config"

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
      effect: "holylight" as SpecParticleEffect,
      atmosphere: "holy" as SpecAtmosphere,
      heroTreeSlugs: [
        "heraldofthesun",
        "lightsmith",
      ],
    },
    {
      id: 66,
      name: "protection",
      url: "/pvp/paladin/protection",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_devotionaura.jpg",
      atmosphere: "iron" as SpecAtmosphere,
      heroTreeSlugs: [
        "lightsmith",
        "templar",
      ],
    },
    {
      id: 70,
      name: "retribution",
      url: "/pvp/paladin/retribution",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_auraoflight.jpg",
      effect: "holyfire" as SpecParticleEffect,
      atmosphere: "holy" as SpecAtmosphere,
      heroTreeSlugs: [
        "heraldofthesun",
        "templar",
      ],
    },
  ],
  heroTrees: [
    {
      slug: "templar",
      name: "Templar",
      signatures: [
        "Light's Guidance",
        "Shake the Heavens",
        "Hammer and Anvil",
      ],
    },
    {
      slug: "lightsmith",
      name: "Lightsmith",
      signatures: [
        "Holy Armaments",
        "Holy Bulwark",
        "Blessing of the Forge",
      ],
    },
    {
      slug: "heraldofthesun",
      name: "Herald of the Sun",
      signatures: [
        "Dawnlight",
        "Sun's Avatar",
        "Sun Sear",
      ],
    },
  ],
}

export default PaladinConfig
