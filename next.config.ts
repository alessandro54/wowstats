import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
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
    ],
  },
}

export default nextConfig
