import type { MetadataRoute } from "next"

const pages = [
  "",
  "/champions",
  "/augments",
  "/items",
  "/runes",
  "/builds",
  "/meta",
  "/patches",
  "/combinations",
  "/compare",
  "/methodology",
  "/about",
  "/support",
  "/login",
  "/profile",
  "/profile/accounts",
  "/profile/preferences",
  "/admin",
]

const locales = ["zh", "en", "ko"]

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `https://summoner-atlas.yonjay.me/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: page === "" ? 1 : 0.7,
    }))
  )
}
