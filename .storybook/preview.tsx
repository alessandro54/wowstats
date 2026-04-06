import { withThemeByClassName } from "@storybook/addon-themes"
import type { Preview } from "@storybook/react-vite"
import { HoverProvider } from "../src/components/providers/hover-provider"
import { ThemeProvider } from "../src/components/providers/theme-provider"
import "../src/app/globals.css"

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "dark",
    }),
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <HoverProvider>
          <Story />
        </HoverProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },
}

export default preview
