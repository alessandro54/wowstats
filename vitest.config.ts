import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { storybookTest } from "@storybook/experimental-addon-test/vitest-plugin";
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
        plugins: [storybookTest({ configDir: ".storybook" })],
        test: {
          name: "storybook",
          environment: "jsdom",
          globals: true,
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
