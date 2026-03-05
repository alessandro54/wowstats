import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaEnchant, MetaGem, MetaItem } from "../../lib/api"
import type { EnchantGroup } from "../../components/molecules/item-card"
import { ItemCard } from "../../components/molecules/item-card"
import { HoverProvider } from "../../components/providers/hover-provider"

function makeItem(slot: string, name: string, pct: number, quality = "EPIC", crafted = false): MetaItem {
  return {
    id: Math.random() * 100000 | 0,
    item: {
      id: Math.random() * 100000 | 0,
      blizzard_id: 200000 + (Math.random() * 1000 | 0),
      name,
      icon_url: "https://wow.zamimg.com/images/wow/icons/large/inv_helmet_154.jpg",
      quality,
    },
    slot,
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    snapshot_at: "2026-03-03T00:00:00Z",
    crafted,
    top_crafting_stats: crafted ? ["Haste", "Versatility"] : [],
  }
}

function makeEnchant(slot: string, name: string, pct: number): MetaEnchant {
  return {
    id: Math.random() * 100000 | 0,
    enchantment: {
      id: Math.random() * 100000 | 0,
      blizzard_id: 7000 + (Math.random() * 1000 | 0),
      name,
    },
    slot,
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    snapshot_at: "2026-03-03T00:00:00Z",
  }
}

function makeGem(socketType: string, name: string, pct: number): MetaGem {
  return {
    id: Math.random() * 100000 | 0,
    item: {
      id: Math.random() * 100000 | 0,
      blizzard_id: 300000 + (Math.random() * 1000 | 0),
      name,
      icon_url: "https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_sapphire_02.jpg",
      quality: "RARE",
    },
    slot: "GEM",
    socket_type: socketType,
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    snapshot_at: "2026-03-03T00:00:00Z",
  }
}

const headEntries: MetaItem[] = [
  makeItem("HEAD", "Dreadful Helm of Conquest", 72.1),
  makeItem("HEAD", "Primal Helm of the Gladiator", 20.3),
  makeItem("HEAD", "Wrathful Helm", 7.6),
]

const mainHandEntries: MetaItem[] = [
  makeItem("MAIN_HAND", "Decimator, the Cruel", 95.4, "LEGENDARY"),
  makeItem("MAIN_HAND", "Void-Touched Blade", 4.6, "EPIC"),
]

const craftedEntries: MetaItem[] = [
  makeItem("HANDS", "Reshii Wraps of Insanity", 54.0, "EPIC", true),
  makeItem("HANDS", "Gladiator Gauntlets", 46.0, "EPIC", false),
]

const enchants = new Map<string, EnchantGroup>([
  [
    "MAIN_HAND",
    {
      slot: "MAIN_HAND",
      entries: [
        makeEnchant("MAIN_HAND", "Authority of Storms", 82.0),
        makeEnchant("MAIN_HAND", "Stormrider's Fury", 18.0),
      ],
    },
  ],
])

const fiberGems: MetaGem[] = [
  makeGem("TINKER", "Magnificent Jeweler's Setting", 85.0),
  makeGem("TINKER", "Masterful Jewel Doublet", 15.0),
]

const pillStyle = { "--pill-color": "#c79c6e" } as React.CSSProperties

const meta = {
  title: "Molecules/ItemCard",
  component: ItemCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A single equipment slot card showing the top item, its usage percentage, optional enchant, and crafted/fiber badges. Clicking opens a distribution tooltip.",
      },
    },
    layout: "padded",
  },
  decorators: [
    (Story: any) => (
      <HoverProvider>
        <div style={{ maxWidth: 340 }}>
          <Story />
        </div>
      </HoverProvider>
    ),
  ],
  args: {
    slot: "HEAD",
    entries: headEntries,
    enchants: new Map(),
    fiberGems: [],
    activeColor: "#c79c6e",
    pillStyle,
  },
} satisfies Meta<typeof ItemCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: "Basic item card with multiple distribution alternatives." } },
  },
}

export const WithEnchant: Story = {
  args: {
    slot: "MAIN_HAND",
    entries: mainHandEntries,
    enchants,
  },
  parameters: {
    docs: { description: { story: "Item card with enchant shown below the item name." } },
  },
}

export const Crafted: Story = {
  args: {
    slot: "HANDS",
    entries: craftedEntries,
  },
  parameters: {
    docs: { description: { story: "Crafted item shows the CRAFTED badge." } },
  },
}

export const Empty: Story = {
  args: {
    entries: undefined,
  },
  parameters: {
    docs: { description: { story: "Renders an empty placeholder when no entries are provided." } },
  },
}
