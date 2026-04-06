import type { Plugin } from "vitest/config"
import path from "node:path"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import react from "@vitejs/plugin-react"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    coverage: {
      exclude: ["src/components/ui/**"],
    },
    projects: [
      {
        resolve: {
          alias: { "@": path.resolve(__dirname, "./src") },
        },
        plugins: [
          // React Compiler is intentionally disabled in tests — it generates
          // internal memoization branches that skew coverage metrics.
          react(),
          {
            name: "raw-glsl",
            transform(code: string, id: string) {
              if (/\.(glsl|vert|frag)$/.test(id)) {
                return { code: `export default ${JSON.stringify(code)};`, map: null }
              }
            },
          },
        ],
        test: {
          name: "unit",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./vitest.setup.ts"],
          include: ["src/**/*.{test,spec}.{ts,tsx}"],
        },
      },
      {
        resolve: {
          alias: { "@": path.resolve(__dirname, "./src") },
        },
        plugins: [
          storybookTest({ configDir: path.resolve(__dirname, ".storybook") }) as unknown as Plugin,
        ],
        test: {
          name: "storybook",
          globals: true,
          setupFiles: [".storybook/vitest.setup.ts"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
})
