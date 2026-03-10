import type { Meta, StoryObj } from "@storybook/react-vite"
import type { WowClassConfig } from "../../config/wow/classes/classes-config"
import { HoverProvider } from "../../components/providers/hover-provider"
import { ClassAccordion } from "../../components/molecules/class-accordion"

const sampleClasses: WowClassConfig[] = [
  {
    id: 1,
    name: "Warrior",
    slug: "warrior",

    color: "#c79c6e",
    colorOlkch: "oklch(0.4908 0.1619 29.16)",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_warrior.jpg",
    iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_warrior.jpg",
    bannerUrl: "",
    specs: [

      {
        id: 71,
        name: "arms",
        url: "/pvp/warrior/arms",
        iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg",
        iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg",
        splash: { url: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg" },
      },
      { id: 72, name: "fury", url: "/pvp/warrior/fury", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_innerrage.jpg", iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_innerrage.jpg", splash: { url: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_innerrage.jpg" } },
      { id: 73, name: "protection", url: "/pvp/warrior/protection", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_defensivestance.jpg", iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_defensivestance.jpg", splash: { url: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_defensivestance.jpg" } },
    ],
  },
  {
    id: 2,
    slug: "mage",
    name: "Mage",
    color: "#69ccf0",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_mage.jpg",
    iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_mage.jpg",
    bannerUrl: "",
    colorOlkch: "oklch(0.7508 0.2531 199.54)",
    specs: [
      { id: 62, name: "arcane", url: "/pvp/mage/arcane", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_magicalsentry.jpg", iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_magicalsentry.jpg", splash: { url: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_magicalsentry.jpg" } },
      { id: 63, name: "fire", url: "/pvp/mage/fire", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_fire_firebolt02.jpg", iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_fire_firebolt02.jpg", splash: { url: "https://render.worldofwarcraft.com/us/icons/56/spell_fire_firebolt02.jpg" } },
      { id: 64, name: "frost", url: "/pvp/mage/frost", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg", iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg", splash: { url: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg" } },
    ],
  },
]

const meta = {
  title: "Molecules/ClassAccordion",
  component: ClassAccordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Mobile-friendly accordion showing WoW classes with expandable spec lists linking to PvP pages.",
      },
    },
    layout: "centered",
  },
  decorators: [Story => <HoverProvider><div style={{ width: 320 }}><Story /></div></HoverProvider>],
} satisfies Meta<typeof ClassAccordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { classes: sampleClasses },
}

export const SingleClass: Story = {
  args: { classes: [sampleClasses[0]] },
  parameters: { docs: { description: { story: "Single class with three specs." } } },
}
