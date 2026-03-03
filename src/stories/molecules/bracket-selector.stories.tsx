import type { Meta, StoryObj } from "@storybook/react-vite"
import { BracketSelector } from "../../components/molecules/bracket-selector"

// next/navigation is mocked in .storybook/main.ts to return "/warrior/arms/pvp/2v2"
// so the "2v2" bracket will appear active by default.

const meta = {
  title: "Molecules/BracketSelector",
  component: BracketSelector,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Pill-style bracket navigation (2v2 / 3v3 / Solo Shuffle / RBG). The active bracket is highlighted using the class color. Uses `usePathname` to derive the current bracket.",
      },
    },
    layout: "centered",
  },
  args: {
    classSlug: "warrior",
    specSlug: "arms",
  },
} satisfies Meta<typeof BracketSelector>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: "Warrior arms — 2v2 is active (derived from the mocked pathname)." },
    },
  },
}

export const PaladinRetribution: Story = {
  args: { classSlug: "paladin", specSlug: "retribution" },
  parameters: {
    docs: { description: { story: "Paladin pink class color applied to the active pill." } },
  },
}

export const DeathKnight: Story = {
  args: { classSlug: "death-knight", specSlug: "unholy" },
  parameters: {
    docs: { description: { story: "Death Knight red class color." } },
  },
}
