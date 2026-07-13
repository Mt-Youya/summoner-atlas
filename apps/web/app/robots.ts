import type { MetadataRoute } from "next"
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/zh/admin"] },
    sitemap: "https://www.summoner-atlas.top/sitemap.xml",
  }
}
