import type { NextConfig } from "next"

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

export default nextConfig
