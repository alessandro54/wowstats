import type { Meta, StoryObj } from "@storybook/react-vite"
import { TalentIcon } from "../../components/atoms/talent-icon"

const sampleTalent = {
  id: 1,
  talent: {
    id: 1,
    blizzard_id: 12345,
    name: "Mortal Strike",
    description: "A powerful strike that deals physical damage.",
    talent_type: "active",
    spell_id: 12294,
    node_id: 101,
    display_row: 1,
    display_col: 1,
    max_rank: 1,
    default_points: 0,
    icon_url: "https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg",
    prerequisite_node_ids: [],
  },
  usage_count: 1200,
  usage_pct: 74.2,
  in_top_build: true,
  top_build_rank: 1,
  tier: "bis" as const,
  snapshot_at: "2026-03-02T00:00:00Z",
}

const meta = {
  title: "Atoms/TalentIcon",
  component: TalentIcon,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Displays a WoW talent icon with optional tooltip and border styling. Supports partial rank indicators (diagonal clip showing only bottom-right corner) for talents that aren't fully maxed in the top build.",
      },
    },
  },
  argTypes: {
    size: {
      control: {
        type: "range",
        min: 24,
        max: 128,
        step: 8,
      },
      description: "Icon size in pixels",
    },
    activeColor: {
      control: "color",
      description: "Border color for the talent (usually class color)",
    },
    borderClass: {
      control: "text",
      description: "Optional Tailwind border classes (overrides activeColor)",
    },
    partialRank: {
      control: "boolean",
      description: "Shows only bottom-right corner border for partially ranked talents",
    },
  },
  args: {
    talent: sampleTalent,
    size: 56,
    activeColor: "#c79c6e",
    tooltipContent: "Mortal Strike · 74.2%",
    partialRank: false,
  },
} satisfies Meta<typeof TalentIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Standard talent icon with full border. Click to see tooltip.",
      },
    },
  },
}

export const PartialRank: Story = {
  args: {
    partialRank: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Diagonal clip shows only bottom-right border, indicating this talent is partially ranked (e.g., 1/2 points).",
      },
    },
  },
}

export const WithoutTooltip: Story = {
  args: {
    tooltipContent: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: "Icon without tooltip functionality.",
      },
    },
  },
}

export const SizeVariants: Story = {
  args: {
    talent: sampleTalent,
    size: 56,
    activeColor: "#c79c6e",
  },
  parameters: {
    docs: {
      description: {
        story: "Different size options for various use cases.",
      },
    },
  },
  render: () => (
    <div className="flex items-end gap-4">
      {[
        32,
        48,
        56,
        64,
        80,
      ].map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <TalentIcon
            talent={sampleTalent}
            size={size}
            activeColor="#c79c6e"
            tooltipContent={`${size}px`}
          />
          <span className="text-muted-foreground text-xs">
            {size}
            px
          </span>
        </div>
      ))}
    </div>
  ),
}

export const ColorVariants: Story = {
  args: {
    talent: sampleTalent,
    size: 56,
    activeColor: "#c79c6e",
  },
  parameters: {
    docs: {
      description: {
        story: "Different class colors applied to talent borders.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {[
        {
          name: "Warrior",
          color: "#c79c6e",
        },
        {
          name: "Paladin",
          color: "#f58cba",
        },
        {
          name: "Mage",
          color: "#69ccf0",
        },
        {
          name: "Priest",
          color: "#ffffff",
        },
        {
          name: "Rogue",
          color: "#fff569",
        },
        {
          name: "Death Knight",
          color: "#c41f3b",
        },
      ].map(({ name, color }) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <TalentIcon talent={sampleTalent} size={56} activeColor={color} tooltipContent={name} />
          <span className="text-muted-foreground text-xs">{name}</span>
        </div>
      ))}
    </div>
  ),
}
