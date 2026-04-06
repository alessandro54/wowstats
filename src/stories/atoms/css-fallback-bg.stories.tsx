import type { Meta, StoryObj } from "@storybook/react-vite"
import { CssFallbackBg } from "../../components/atoms/css-fallback-bg"

const meta = {
  title: "Atoms/CssFallbackBg",
  component: CssFallbackBg,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Static CSS gradient fallback for the homepage background. Used on low-end devices that cannot run the WebGL shader.",
      },
    },
  },
} satisfies Meta<typeof CssFallbackBg>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
