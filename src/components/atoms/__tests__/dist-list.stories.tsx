import type { Meta, StoryObj } from "@storybook/react-vite"
import type { DistEntry } from "../../components/molecules/distribution-tooltip"
import { DistList } from "../dist-list"

const sampleEntries: DistEntry[] = [
  {
    name: "Helm of Glory",
    pct: 45.5,
    quality: "EPIC",
    icon_url: "https://render.worldofwarcraft.com/us/icons/56/inv_helmet_154.jpg",
  },
  {
    name: "Crown of Valor",
    pct: 30.2,
    quality: "RARE",
  },
  {
    name: "Basic Hood",
    pct: 15.8,
    quality: "UNCOMMON",
  },
]

const meta = {
  title: "Atoms/DistList",
  component: DistList,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Compact list of item/enchant distribution entries with name, optional icon, quality color, and usage percentage.",
      },
    },
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 250,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DistList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    entries: sampleEntries,
  },
}

export const WithoutIcons: Story = {
  args: {
    entries: sampleEntries.map(({ icon_url: _, ...e }) => e),
  },
  parameters: {
    docs: {
      description: {
        story: "Entries without icon URLs.",
      },
    },
  },
}

export const SingleEntry: Story = {
  args: {
    entries: [
      sampleEntries[0],
    ],
  },
}
