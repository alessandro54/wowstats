import type { Meta, StoryObj } from "@storybook/react-vite"
import { SpecParticleFx } from "../spec-particle-fx"

const meta = {
  title: "Molecules/SpecParticleFx",
  component: SpecParticleFx,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SpecParticleFx>

export default meta
type Story = StoryObj<typeof meta>

export const None: Story = {
  args: {},
}
export const Snow: Story = {
  args: {
    effect: "snow",
  },
}
export const RainOfFire: Story = {
  args: {
    effect: "rainoffire",
  },
}
export const Plague: Story = {
  args: {
    effect: "plague",
  },
}
