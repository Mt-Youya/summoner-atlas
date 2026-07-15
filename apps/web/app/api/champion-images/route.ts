import { NextResponse } from "next/server"
import { resolve } from "node:path"

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

  const url = new URL("/rest/v1/static_champions", supabaseUrl)
  url.searchParams.set("select", "id,alias,name_zh,name_en,image_url")
  url.searchParams.set("image_url", "not.is.null")

  const statsUrl = new URL("/rest/v1/resg_champion_stats", supabaseUrl)
  statsUrl.searchParams.set("select", "champion_id,total_matches,avg_win_rate,version")

  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  }
  const [response, statsResponse] = await Promise.all([
    fetch(url, { headers, next: { revalidate: 3600 } }),
    fetch(statsUrl, { headers, next: { revalidate: 3600 } }),
  ])

  if (!response.ok) {
    return NextResponse.json({ images: [] }, { status: 502 })
  }

  const champions = (await response.json()) as {
    id: number
    alias: string
    name_zh: string
    name_en: string
    image_url: string | null
  }[]
  const stats = statsResponse.ok
    ? ((await statsResponse.json()) as {
        champion_id: number
        total_matches: number
        avg_win_rate: number
        version: string
      }[])
    : []
  const latestStats = new Map<number, { total_matches: number; avg_win_rate: number; version: string }>()
  for (const stat of stats) {
    const current = latestStats.get(stat.champion_id)
    if (!current || stat.version.localeCompare(current.version, undefined, { numeric: true }) > 0) {
      latestStats.set(stat.champion_id, stat)
    }
  }

  return NextResponse.json(
    {
      champions: champions.flatMap(({ id, alias, name_zh, name_en, image_url }) => {
        if (!image_url || alias === "None") return []
        const stat = latestStats.get(id)
        return [
          {
            id,
            alias,
            nameZh: name_zh,
            name: name_en,
            imageUrl: normalizeImageUrl(image_url),
            matches: stat?.total_matches ?? null,
            winRate: stat?.avg_win_rate ?? null,
          },
        ]
      }),
    },
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" } }
  )
}
