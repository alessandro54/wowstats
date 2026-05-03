import type { Meta, StoryObj } from "@storybook/react-vite"
import { LazyImage } from "../lazy-image"

const meta = {
  title: "Atoms/LazyImage",
  component: LazyImage,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LazyImage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: "https://render.worldofwarcraft.com/us/icons/56/spell_warrior_savageblow.jpg",
    alt: "Icon",
    width: 64,
    height: 64,
  },
}
