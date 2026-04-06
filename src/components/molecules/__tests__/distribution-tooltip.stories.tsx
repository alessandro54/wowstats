import type { Meta, StoryObj } from "@storybook/react-vite"
import type { DistEntry } from "../distribution-tooltip"
import { DistributionTooltip } from "../distribution-tooltip"

const weaponEntries: DistEntry[] = [
  {
    name: "Void-Touched Claymore",
    pct: 61.3,
  },
  {
    name: "Emerald Dream Greatsword",
    pct: 22.7,
  },
  {
    name: "Ulduar's Echo",
    pct: 10.1,
  },
  {
    name: "Other",
    pct: 5.9,
  },
]

const enchantEntries: DistEntry[] = [
  {
    name: "Authority of Radiant Power",
    pct: 54.8,
  },
  {
    name: "Authority of the Depths",
    pct: 30.2,
  },
  {
    name: "Stormrider's Fury",
    pct: 15.0,
  },
]

const fiberGems = [
  {
    id: 1,
    item: {
      id: 1,
      blizzard_id: 222111,
      name: "Masterful Jewel Doublet",
      icon_url: "",
      quality: "rare",
    },
    slot: "fiber",
    socket_type: "fiber",
    usage_count: 450,
    usage_pct: 72.4,
    snapshot_at: "2026-03-02T00:00:00Z",
  },
  {
    id: 2,
    item: {
      id: 2,
      blizzard_id: 222112,
      name: "Quick Jewel Cluster",
      icon_url: "",
      quality: "rare",
    },
    slot: "fiber",
    socket_type: "fiber",
    usage_count: 171,
    usage_pct: 27.6,
    snapshot_at: "2026-03-02T00:00:00Z",
  },
]

const meta = {
  title: "Molecules/DistributionTooltip",
  component: DistributionTooltip,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Tooltip content showing alternative item/enchant distributions, crafting stats, and fiber gem choices. Rendered inside a Radix tooltip popup.",
      },
    },
    layout: "centered",
  },
  args: {
    entries: weaponEntries,
    activeColor: "#c79c6e",
  },
} satisfies Meta<typeof DistributionTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const AlternativesOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: "Shows item alternatives (entries after index 0).",
      },
    },
  },
}

export const WithEnchantAlternatives: Story = {
  args: {
    enchantEntries,
  },
  parameters: {
    docs: {
      description: {
        story: "Two-column layout: item alternatives + enchant alternatives.",
      },
    },
  },
}

export const WithCraftingStats: Story = {
  args: {
    craftingStats: [
      "haste",
      "crit",
      "mastery",
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Includes a crafted-item stat section below the alternatives.",
      },
    },
  },
}

export const WithFiberGems: Story = {
  args: {
    fiberGems,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows fiber socket gem options below the alternatives.",
      },
    },
  },
}

export const FullTooltip: Story = {
  args: {
    enchantEntries,
    craftingStats: [
      "haste",
      "crit",
    ],
    fiberGems,
  },
  parameters: {
    docs: {
      description: {
        story: "All sections combined.",
      },
    },
  },
}
