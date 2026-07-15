import { resolve } from "node:path"
import { NextResponse } from "next/server"

try {
  process.loadEnvFile(resolve(process.cwd(), "../../.env"))
} catch {
  // Deployment environments provide variables directly; local .env is optional.
}

const supabaseUrl =
  process.env.SUPABASE_URL ??
  process.env.SUMMONER_ATLAS_SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUMMONER_ATLAS_SUPABASE_SUMMONER_ATLAS_SUPABASE_URL

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUMMONER_ATLAS_SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUMMONER_ATLAS_SUPABASE_SECRET_KEY

function normalizeImageUrl(imageUrl: string) {
  const defaultPath = "/global/default/"
  const pathStart = imageUrl.indexOf(defaultPath)

  if (pathStart < 0) return imageUrl

  const baseUrl = imageUrl.slice(0, pathStart + defaultPath.length)
  const assetPath = imageUrl
    .slice(pathStart + defaultPath.length)
    .replace(/^lol-game-data\/assets\//, "")
    .toLowerCase()

  return `${baseUrl}${assetPath}`
}

export async function GET() {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ images: [] }, { status: 503 })
  }

  const url = new URL("/rest/v1/static_augments", supabaseUrl)
  url.searchParams.set("select", "name_en,icon_url")
  url.searchParams.set("icon_url", "not.is.null")

  const response = await fetch(url, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    return NextResponse.json({ images: [] }, { status: 502 })
  }

  const images = (await response.json()) as { name_en: string; icon_url: string | null }[]
  return NextResponse.json(
    {
      images: images.flatMap(({ name_en, icon_url }) =>
        icon_url ? [{ name: name_en, imageUrl: normalizeImageUrl(icon_url) }] : []
      ),
    },
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" } }
  )
}
