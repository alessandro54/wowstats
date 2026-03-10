import type { Meta, StoryObj } from "@storybook/react-vite"
import type { WowClassConfig } from "../../config/wow/classes/classes-config"
import { HoverProvider } from "../../components/providers/hover-provider"
import { ClassPanels } from "../../components/molecules/class-panels"

const sampleClasses: WowClassConfig[] = [
  {
    id: 1,
    name: "Warrior",
    slug: "warrior",

    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_warrior.jpg",
    iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_warrior.jpg",
    bannerUrl: "",
    specs: [
      {
        id: 71,
        name: "arms",
        url: "/pvp/warrior/arms",
        iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg",
        iconRemasteredUrl:
          "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg",
        splash: {
          url: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg",
        },
      },
      {
        id: 72,
        name: "fury",
        url: "/pvp/warrior/fury",
        iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_innerrage.jpg",
        iconRemasteredUrl:
          "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_innerrage.jpg",
        splash: {
          url: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_innerrage.jpg",
        },
      },
      {
        id: 73,
        name: "protection",
        url: "/pvp/warrior/protection",
        iconUrl:
          "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_defensivestance.jpg",
        iconRemasteredUrl:
          "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_defensivestance.jpg",
        splash: {
          url: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_defensivestance.jpg",
        },
      },
    ],
  },
  {
    id: 2,
    slug: "mage",
    name: "Mage",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_mage.jpg",
    iconRemasteredUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_mage.jpg",
    bannerUrl: "",
    specs: [
      {
        id: 62,
        name: "arcane",
        url: "/pvp/mage/arcane",
        iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_magicalsentry.jpg",
        iconRemasteredUrl:
          "https://render.worldofwarcraft.com/us/icons/56/spell_holy_magicalsentry.jpg",
        splash: {
          url: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_magicalsentry.jpg",
        },
      },
      {
        id: 63,
        name: "fire",
        url: "/pvp/mage/fire",
        iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_fire_firebolt02.jpg",
        iconRemasteredUrl:
          "https://render.worldofwarcraft.com/us/icons/56/spell_fire_firebolt02.jpg",
        splash: {
          url: "https://render.worldofwarcraft.com/us/icons/56/spell_fire_firebolt02.jpg",
        },
      },
      {
        id: 64,
        name: "frost",
        url: "/pvp/mage/frost",
        iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg",
        iconRemasteredUrl:
          "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg",
        splash: {
          url: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg",
        },
      },
    ],
  },
]

const meta = {
  title: "Molecules/ClassPanels",
  component: ClassPanels,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Desktop class selector with expandable panels, magnification effect, and a slider track for quick class selection.",
      },
    },
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <HoverProvider>
        <div
          style={{
            height: 400,
            width: "100%",
          }}
        >
          <Story />
        </div>
      </HoverProvider>
    ),
  ],
} satisfies Meta<typeof ClassPanels>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    classes: sampleClasses,
  },
}
