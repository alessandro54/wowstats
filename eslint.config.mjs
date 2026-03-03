import antfu from "@antfu/eslint-config"
import storybook from "eslint-plugin-storybook"

export default antfu(
  {
    react: true,
    nextjs: true,
    typescript: true,
    formatters: {
      css: true,
      markdown: "prettier",
    },
    stylistic: {
      quotes: "double",
    },
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "storybook-static/**",
      "next-env.d.ts",
      "src/components/ui/**",
    ],
  },
  ...storybook.configs["flat/recommended"],
  {
    files: ["**/*.test.{ts,tsx}", "**/*.stories.{ts,tsx}"],
    rules: {
      "react/no-array-index-key": "off",
      "react-refresh/only-export-components": "off",
    },
  },
  {
    files: ["**/providers/**", "**/hooks/**", "**/organisms/**"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    rules: {
      "node/prefer-global/process": "off",
      "react-hooks-extra/no-direct-set-state-in-use-effect": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
)
