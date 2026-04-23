import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    staleTimes: { dynamic: 0 },
  },
  turbopack: {
    rules: {
      "*.glsl": { loaders: ["./loaders/raw.js"], as: "*.js" },
      "*.vert": { loaders: ["./loaders/raw.js"], as: "*.js" },
      "*.frag": { loaders: ["./loaders/raw.js"], as: "*.js" },
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "render.worldofwarcraft.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-627f5a049a2d470c85b1b70cbd99a5ce.r2.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.wowinsights.xyz",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default withSentryConfig(nextConfig, {
  org: "wow-bis",
  project: "wow-bis-web-production",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
})
