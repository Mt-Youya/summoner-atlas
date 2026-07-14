import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@summoner-atlas/i18n", "@summoner-atlas/data-access"],
}

export default nextConfig
