import type { Meta, StoryObj } from "@storybook/react-vite"
import type { WowClassConfig } from "../../config/wow/classes/classes-config"
import { HoverProvider } from "../../components/providers/hover-provider"
import { ClassAccordion } from "../../components/molecules/class-accordion"

const sampleClasses: WowClassConfig[] = [
  {
    slug: "warrior",
    name: "Warrior",
    color: "#c79c6e",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_warrior.jpg",
    iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_warrior.jpg",
    bannerUrl: null,
    specs: [
      { id: 71, name: "arms", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg", iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg", splashUrl: null, role: "dps" },
      { id: 72, name: "fury", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_innerrage.jpg", iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_innerrage.jpg", splashUrl: null, role: "dps" },
      { id: 73, name: "protection", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_defensivestance.jpg", iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_defensivestance.jpg", splashUrl: null, role: "tank" },
    ],
  },
  {
    slug: "mage",
    name: "Mage",
    color: "#69ccf0",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_mage.jpg",
    iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_mage.jpg",
    bannerUrl: null,
    specs: [
      { id: 62, name: "arcane", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_magicalsentry.jpg", iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_magicalsentry.jpg", splashUrl: null, role: "dps" },
      { id: 63, name: "fire", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_fire_firebolt02.jpg", iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_fire_firebolt02.jpg", splashUrl: null, role: "dps" },
      { id: 64, name: "frost", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg", iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg", splashUrl: null, role: "dps" },
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
