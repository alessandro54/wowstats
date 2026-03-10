import type { Meta, StoryObj } from "@storybook/react-vite"
import { BracketPanels } from "../../components/molecules/bracket-panels"

const meta = {
  title: "Molecules/BracketPanels",
  component: BracketPanels,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Four horizontal expanding panels for bracket selection. Hover (desktop) or first tap (touch) expands a panel to reveal its label and description; the others compress. Click/second tap navigates.",
      },
    },
    layout: "padded",
  },
  args: {
    classSlug: "warrior",
    specSlug: "arms",
    classColor: "#C69B6D",
  },
} satisfies Meta<typeof BracketPanels>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Warrior arms — hover a panel to expand it.",
      },
    },
  },
}

export const DeathKnight: Story = {
  args: {
    classSlug: "death-knight",
    specSlug: "frost",
    classColor: "#C41E3A",
  },
  parameters: {
    docs: {
      description: {
        story: "Death Knight red class color.",
      },
    },
  },
}

export const Paladin: Story = {
  args: {
    classSlug: "paladin",
    specSlug: "retribution",
    classColor: "#F48CBA",
  },
  parameters: {
    docs: {
      description: {
        story: "Paladin pink class color.",
      },
    },
  },
}

export const Mage: Story = {
  args: {
    classSlug: "mage",
    specSlug: "frost",
    classColor: "#3FC7EB",
  },
  parameters: {
    docs: {
      description: {
        story: "Mage blue class color.",
      },
    },
  },
}
