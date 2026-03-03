import { defineConfig, type Plugin } from "vitest/config";
import react from "@vitejs/plugin-react";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import path from "path";

export default defineConfig({
  test: {
    projects: [
      {
        resolve: {
          alias: { "@": path.resolve(__dirname, "./src") },
        },
        plugins: [
          react({
            babel: {
              plugins: ["babel-plugin-react-compiler"],
            },
          }),
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
            provider: playwright({ browser: "chromium", headless: true }),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
