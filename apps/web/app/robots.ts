import type { MetadataRoute } from "next"
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/zh/admin"] },
    sitemap: "https://summoner-atlas.yonjay.me/sitemap.xml",
  }
}
