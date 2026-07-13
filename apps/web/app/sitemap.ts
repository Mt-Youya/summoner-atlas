import type { MetadataRoute } from "next"

const pages = [
  "/zh",
  "/zh/champions",
  "/zh/augments",
  "/zh/items",
  "/zh/runes",
  "/zh/builds",
  "/zh/meta",
  "/zh/patches",
  "/zh/combinations",
  "/zh/compare",
  "/zh/methodology",
  "/zh/about",
  "/zh/support",
  "/zh/login",
  "/zh/profile",
  "/zh/profile/accounts",
  "/zh/profile/preferences",
  "/zh/admin",
]

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: `https://summoner-atlas.yonjay.me${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "/zh" ? 1 : 0.7,
  }))
}
