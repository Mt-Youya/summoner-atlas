import type { MetadataRoute } from "next"
const pages = [
  "/zh",
  "/zh/champions",
  "/zh/augments",
  "/zh/combinations",
  "/zh/methodology",
  "/zh/about",
  "/zh/support",
  "/zh/login",
  "/zh/profile",
]
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: `https://summoner-atlas.yonjay.me${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "/zh" ? 1 : 0.7,
  }))
}
