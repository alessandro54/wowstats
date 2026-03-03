import type { Meta, StoryObj } from "@storybook/react-vite"
import { SpecHeading } from "../../components/atoms/spec-heading"

const meta = {
  title: "Atoms/SpecHeading",
  component: SpecHeading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Displays the class/spec heading with bracket information. Extracts the bracket from the current URL path and applies class-specific theming. Used at the top of spec detail pages.",
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "Display name of the WoW class (e.g., 'Warrior', 'Death Knight')",
    },
    classSlug: {
      control: "select",
      options: [
        "warrior",
        "paladin",
        "death-knight",
        "mage",
        "priest",
        "warlock",
        "rogue",
        "druid",
        "hunter",
        "shaman",
        "monk",
        "demon-hunter",
        "evoker",
      ],
      description: "WoW class slug for CSS variable theming",
    },
    specSlug: {
      control: "text",
      description: "Spec name (e.g., 'arms', 'holy', 'frost')",
    },
  },
} satisfies Meta<typeof SpecHeading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    className: "Warrior",
    classSlug: "warrior",
    specSlug: "arms",
  },
}

export const DeathKnight: Story = {
  args: {
    className: "Death Knight",
    classSlug: "death-knight",
    specSlug: "frost",
  },
  parameters: {
    docs: {
      description: {
        story: "Example with multi-word class name showing proper capitalization.",
      },
    },
  },
}

export const AllClasses: Story = {
  args: {
    className: "Warrior",
    classSlug: "warrior",
    specSlug: "arms",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows all WoW classes with their respective color themes.",
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <SpecHeading className="Warrior" classSlug="warrior" specSlug="arms" />
      <SpecHeading className="Paladin" classSlug="paladin" specSlug="holy" />
      <SpecHeading className="Death Knight" classSlug="death-knight" specSlug="frost" />
      <SpecHeading className="Mage" classSlug="mage" specSlug="fire" />
      <SpecHeading className="Priest" classSlug="priest" specSlug="shadow" />
      <SpecHeading className="Rogue" classSlug="rogue" specSlug="assassination" />
      <SpecHeading className="Druid" classSlug="druid" specSlug="balance" />
      <SpecHeading className="Hunter" classSlug="hunter" specSlug="marksmanship" />
    </div>
  ),
}
