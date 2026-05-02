import type { SpecAtmosphere, SpecParticleEffect, WowClassConfig } from "./classes-config"

// Class color: #FF7D0A
const DruidConfig: WowClassConfig = {
  id: 11,
  name: "Druid",
  slug: "druid",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_druid.jpg",
  specs: [
    {
      id: 102,
      name: "balance",
      url: "/pvp/druid/balance",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_nature_starfall.jpg",
      effect: "rainofstars" as SpecParticleEffect,
      atmosphere: "lunar" as SpecAtmosphere,
      heroTreeSlugs: [
        "keeperofthegrove",
        "eluneschosen",
      ],
    },
    {
      id: 103,
      name: "feral",
      url: "/pvp/druid/feral",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_druid_catform.jpg",
      atmosphere: "nature" as SpecAtmosphere,
      heroTreeSlugs: [
        "druidoftheclaw",
        "wildstalker",
      ],
    },
    {
      id: 104,
      name: "guardian",
      url: "/pvp/druid/guardian",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_racial_bearform.jpg",
      atmosphere: "nature" as SpecAtmosphere,
      heroTreeSlugs: [
        "druidoftheclaw",
        "wildstalker",
      ],
    },
    {
      id: 105,
      name: "restoration",
      url: "/pvp/druid/restoration",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_nature_healingtouch.jpg",
      atmosphere: "mist" as SpecAtmosphere,
      heroTreeSlugs: [
        "keeperofthegrove",
        "wildstalker",
      ],
    },
  ],
  heroTrees: [
    {
      slug: "druidoftheclaw",
      name: "Druid of the Claw",
      signatures: [
        "Ravage",
        "Aggravate Wounds",
      ],
    },
    {
      slug: "keeperofthegrove",
      name: "Keeper of the Grove",
      signatures: [
        "Dream Surge",
        "Treants of the Moon",
      ],
    },
    {
      slug: "wildstalker",
      name: "Wildstalker",
      signatures: [
        "Thriving Growth",
        "Bursting Growth",
      ],
    },
    {
      slug: "eluneschosen",
      name: "Elune's Chosen",
      signatures: [
        "Boundless Moonlight",
        "Lunar Insight",
      ],
    },
  ],
}

export default DruidConfig
