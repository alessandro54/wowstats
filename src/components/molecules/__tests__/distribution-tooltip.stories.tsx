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

const gemEntries: DistEntry[] = [
  {
    name: "Masterful Jewel Doublet",
    pct: 72.4,
  },
  {
    name: "Quick Jewel Cluster",
    pct: 27.6,
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

export const WithGems: Story = {
  args: {
    gemEntries,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows gem options below the alternatives.",
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
    gemEntries,
  },
  parameters: {
    docs: {
      description: {
        story: "All sections combined.",
      },
    },
  },
}
