import type { SpecAtmosphere, WowClassConfig } from "./classes-config"

// Class color: #00FF96
const MonkConfig: WowClassConfig = {
  id: 10,
  name: "Monk",
  slug: "monk",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_monk.jpg",
  specs: [
    {
      id: 268,
      name: "brewmaster",
      url: "/pvp/monk/brewmaster",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_monk_brewmaster_spec.jpg",
      atmosphere: "warm" as SpecAtmosphere,
    },
    {
      id: 270,
      name: "mistweaver",
      url: "/pvp/monk/mistweaver",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_monk_mistweaver_spec.jpg",
      atmosphere: "mist" as SpecAtmosphere,
    },
    {
      id: 269,
      name: "windwalker",
      url: "/pvp/monk/windwalker",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_monk_windwalker_spec.jpg",
      atmosphere: "storm" as SpecAtmosphere,
    },
  ],
}

export default MonkConfig
