import type { Meta, StoryObj } from "@storybook/react-vite"
import { TalentCard } from "../../components/atoms/talent-card"

const meta = {
  title: "Atoms/TalentCard",
  component: TalentCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A card container with a subtle class-color gradient background. Used to wrap talent trees, hero talents, and PvP talents.",
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof TalentCard>

export default meta
type Story = StoryObj<typeof meta>

export const WithClassColor: Story = {
  args: {
    classSlug: "warrior",
    children: (
      <div className="flex h-32 w-48 items-center justify-center text-sm text-white">
        Warrior talents
      </div>
    ),
  },
}

export const Mage: Story = {
  args: {
    classSlug: "mage",
    children: (
      <div className="flex h-32 w-48 items-center justify-center text-sm text-white">
        Mage talents
      </div>
    ),
  },
}

export const NoClassColor: Story = {
  args: {
    children: (
      <div className="flex h-32 w-48 items-center justify-center text-sm text-white">
        Generic card
      </div>
    ),
  },
  parameters: {
    docs: {
      description: { story: "Falls back to a neutral card background when no classSlug is provided." },
    },
  },
}

export const AllClasses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["warrior", "paladin", "hunter", "rogue", "priest", "death-knight", "shaman", "mage", "warlock", "monk", "druid", "demon-hunter", "evoker"] as const).map(slug => (
        <TalentCard key={slug} classSlug={slug}>
          <div className="flex h-20 w-28 items-center justify-center text-xs text-white">
            {slug}
          </div>
        </TalentCard>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: { story: "All WoW class gradient variants." },
    },
  },
}
