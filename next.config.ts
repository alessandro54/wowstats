import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

const isDev = process.env.NODE_ENV === "development"

const nextConfig: NextConfig = {
  reactCompiler: !isDev,
  experimental: {},
  turbopack: {
    rules: {
      "*.glsl": { loaders: ["./scripts/raw-loader.js"], as: "*.js" },
      "*.vert": { loaders: ["./scripts/raw-loader.js"], as: "*.js" },
      "*.frag": { loaders: ["./scripts/raw-loader.js"], as: "*.js" },
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
        hostname: "cdn.wowstats.gg",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

// Skip Sentry instrumentation in dev — no source map uploads, no tunnel overhead
if (isDev) {
  module.exports = nextConfig
} else {
  module.exports = withSentryConfig(nextConfig, {
    org: "wow-bis",
    project: "wowstats-web",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: "/monitoring",
    webpack: {
      automaticVercelMonitors: true,
      treeshake: {
        removeDebugLogging: true,
      },
    },
  })
}
