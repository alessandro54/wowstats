import type { Meta, StoryObj } from "@storybook/react-vite"
import type { WowClassConfig } from "../../config/wow/classes/classes-config"
import { HoverProvider } from "../../components/providers/hover-provider"
import { ClassPanels } from "../../components/molecules/class-panels"

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
      { id: 64, name: "frost", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg", iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg", splashUrl: null, role: "dps" },
    ],
  },
  {
    slug: "druid",
    name: "Druid",
    color: "#ff7d0a",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_druid.jpg",
    iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_druid.jpg",
    bannerUrl: null,
    specs: [
      { id: 102, name: "balance", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_nature_starfall.jpg", iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_nature_starfall.jpg", splashUrl: null, role: "dps" },
      { id: 105, name: "restoration", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_nature_healingtouch.jpg", iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_nature_healingtouch.jpg", splashUrl: null, role: "healer" },
    ],
  },
]

const meta = {
  title: "Molecules/ClassPanels",
  component: ClassPanels,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Desktop class selector with expandable panels, magnification effect, and a slider track for quick class selection.",
      },
    },
    layout: "fullscreen",
  },
  decorators: [Story => <HoverProvider><div style={{ height: 400, width: "100%" }}><Story /></div></HoverProvider>],
} satisfies Meta<typeof ClassPanels>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { classes: sampleClasses },
}
