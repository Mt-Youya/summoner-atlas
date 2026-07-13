import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.communitydragon.org",
        pathname: "/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/**",
      },
    ],
  },
}

export default nextConfig
