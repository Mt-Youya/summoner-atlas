import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@summoner-atlas/i18n"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.communitydragon.org",
        pathname: "/latest/plugins/rcp-be-lol-game-data/global/default/**",
      },
      {
        protocol: "https",
        hostname: "ddragon.leagueoflegends.com",
        pathname: "/cdn/**",
      },
      {
        protocol: "https",
        hostname: "resg.top",
        pathname: "/assets/**",
      },
    ],
  },
}

export default nextConfig
