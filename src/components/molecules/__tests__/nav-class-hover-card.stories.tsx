import type { Meta, StoryObj } from "@storybook/react-vite"
import { SidebarMenu, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar"
import type { NavMainItem } from "@/config/wow/nav-config"
import { NavClassHoverCard } from "../nav-class-hover-card"

const warriorItem: NavMainItem = {
  id: 1,
  title: "Warrior",
  slug: "warrior",
  url: "/warrior",
  color: "#c79c6e",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_warrior.jpg",
  items: [
    {
      id: 71,
      title: "Arms",
      url: "/warrior/arms",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg",
    },
    {
      id: 72,
      title: "Fury",
      url: "/warrior/fury",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_innerrage.jpg",
    },
    {
      id: 73,
      title: "Protection",
      url: "/warrior/protection",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_defensivestance.jpg",
    },
  ],
}

const mageItem: NavMainItem = {
  id: 8,
  title: "Mage",
  slug: "mage",
  url: "/mage",
  color: "#69ccf0",
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/classicon_mage.jpg",
  items: [
    {
      id: 62,
      title: "Arcane",
      url: "/mage/arcane",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_magicalsentry.jpg",
    },
    {
      id: 63,
      title: "Fire",
      url: "/mage/fire",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_fire_firebolt02.jpg",
    },
    {
      id: 64,
      title: "Frost",
      url: "/mage/frost",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg",
    },
  ],
}

function withSidebar(Story: React.ComponentType) {
  return (
    <SidebarProvider>
      <SidebarMenu>
        <SidebarMenuItem>
          <Story />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarProvider>
  )
}

const meta = {
  title: "Molecules/NavClassHoverCard",
  component: NavClassHoverCard,
  tags: [
    "autodocs",
  ],
  decorators: [
    withSidebar,
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Sidebar navigation item that reveals a hover card with spec links and quick bracket shortcuts. Hover over the button to see the card.",
      },
    },
    layout: "centered",
  },
  args: {
    item: warriorItem,
    onMouseEnter: () => {},
  },
} satisfies Meta<typeof NavClassHoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Warrior: Story = {
  parameters: {
    docs: {
      description: {
        story: "Hover to see Arms, Fury, Protection specs with 2v2/3v3/Solo shortcuts.",
      },
    },
  },
}

export const Mage: Story = {
  args: {
    item: mageItem,
  },
  parameters: {
    docs: {
      description: {
        story: "Mage class with Arcane, Fire, Frost specs.",
      },
    },
  },
}
