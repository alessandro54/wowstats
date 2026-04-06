import type { Meta, StoryObj } from "@storybook/react-vite"
import { HoverProvider } from "../../components/providers/hover-provider"
import type { MetaEnchant, MetaGem, MetaItem } from "../../lib/api"
import { Equipment } from "../equipment"

function makeItem(
  slot: string,
  name: string,
  pct: number,
  quality = "EPIC",
  crafted = false,
): MetaItem {
  return {
    id: (Math.random() * 100000) | 0,
    item: {
      id: (Math.random() * 100000) | 0,
      blizzard_id: 200000 + ((Math.random() * 1000) | 0),
      name,
      icon_url: "https://wow.zamimg.com/images/wow/icons/large/inv_helmet_154.jpg",
      quality,
    },
    slot,
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    snapshot_at: "2026-03-03T00:00:00Z",
    crafted,
    top_crafting_stats: crafted
      ? [
          "Haste",
          "Versatility",
        ]
      : [],
  }
}

function makeEnchant(slot: string, name: string, pct: number): MetaEnchant {
  return {
    id: (Math.random() * 100000) | 0,
    enchantment: {
      id: (Math.random() * 100000) | 0,
      blizzard_id: 7000 + ((Math.random() * 1000) | 0),
      name,
    },
    slot,
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    snapshot_at: "2026-03-03T00:00:00Z",
  }
}

function makeGem(socketType: string, name: string, pct: number, quality = "RARE"): MetaGem {
  return {
    id: (Math.random() * 100000) | 0,
    item: {
      id: (Math.random() * 100000) | 0,
      blizzard_id: 300000 + ((Math.random() * 1000) | 0),
      name,
      icon_url: "https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_sapphire_02.jpg",
      quality,
    },
    slot: "GEM",
    socket_type: socketType,
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    snapshot_at: "2026-03-03T00:00:00Z",
  }
}

const sampleItems: {
  slot: string
  entries: MetaItem[]
}[] = [
  {
    slot: "HEAD",
    entries: [
      makeItem("HEAD", "Dreadful Helm of Conquest", 72.1),
      makeItem("HEAD", "Primal Helm", 27.9),
    ],
  },
  {
    slot: "NECK",
    entries: [
      makeItem("NECK", "Amulet of Wrathful Strikes", 88.5),
    ],
  },
  {
    slot: "SHOULDER",
    entries: [
      makeItem("SHOULDER", "Shoulderplates of Fury", 65.0),
    ],
  },
  {
    slot: "CHEST",
    entries: [
      makeItem("CHEST", "Breastplate of the Gladiator", 91.2),
    ],
  },
  {
    slot: "HANDS",
    entries: [
      makeItem("HANDS", "Reshii's Wraps of Insanity", 54.0, "EPIC", true),
    ],
  },
  {
    slot: "LEGS",
    entries: [
      makeItem("LEGS", "Legguards of the Arena", 78.3),
    ],
  },
  {
    slot: "MAIN_HAND",
    entries: [
      makeItem("MAIN_HAND", "Decimator, the Cruel", 95.4, "LEGENDARY"),
    ],
  },
]

const sampleEnchants: {
  slot: string
  entries: MetaEnchant[]
}[] = [
  {
    slot: "MAIN_HAND",
    entries: [
      makeEnchant("MAIN_HAND", "Authority of Storms", 82.0),
    ],
  },
  {
    slot: "CHEST",
    entries: [
      makeEnchant("CHEST", "Enchant Chest - Crystalline Radiance", 67.5),
    ],
  },
]

const sampleGems: {
  socketType: string
  entries: MetaGem[]
}[] = [
  {
    socketType: "PRISMATIC",
    entries: [
      makeGem("PRISMATIC", "Deadly Sapphire", 73.0),
      makeGem("PRISMATIC", "Masterful Emerald", 27.0),
    ],
  },
]

const fiberGems: MetaGem[] = [
  makeGem("TINKER", "Magnificent Jeweler's Setting", 85.0),
]

const meta = {
  title: "Organisms/Equipment",
  component: Equipment,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Equipment grid displaying items, enchants, and gems in paired rows (matching WoW slot layout). Each item has a clickable tooltip showing distribution data.",
      },
    },
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <HoverProvider>
        <div
          style={{
            maxWidth: 700,
          }}
        >
          <Story />
        </div>
      </HoverProvider>
    ),
  ],
} satisfies Meta<typeof Equipment>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    classSlug: "warrior",
    itemGroups: sampleItems,
    enchantGroups: sampleEnchants,
    gemGroups: sampleGems,
    fiberGems: [],
  },
}

export const WithFiberGems: Story = {
  args: {
    classSlug: "warrior",
    itemGroups: sampleItems,
    enchantGroups: sampleEnchants,
    gemGroups: sampleGems,
    fiberGems,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the fiber gem badge on crafted items (Reshii Wraps).",
      },
    },
  },
}

export const EmptySlots: Story = {
  args: {
    classSlug: "mage",
    itemGroups: [],
    enchantGroups: [],
    gemGroups: [],
    fiberGems: [],
  },
  parameters: {
    docs: {
      description: {
        story: "No item data available — shows empty state message.",
      },
    },
  },
}
