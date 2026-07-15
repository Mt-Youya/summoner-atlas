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

function colorImageUrl(imageUrl: string) {
  const fileName = new URL(imageUrl).pathname.split("/").at(-1)?.toLowerCase()
  const slug = fileName?.replace(/_small\.png$/, "").replace(/\.png$/, "")

  if (slug?.startsWith("genericabilityaugmenticon_")) {
    return imageUrl
  }

  return slug
    ? `https://raw.communitydragon.org/latest/game/assets/ux/cherry/augments/icons/${slug}_large.png`
    : imageUrl
}

const unavailableRankingImages = new Set([1205, 2076])

function descriptionText(description: string) {
  return description
    .replaceAll(/<br\s*\/?\s*>/gi, " ")
    .replaceAll(/<[^>]+>/g, "")
    .replaceAll(/\s+/g, " ")
    .trim()
}

function isNewerVersion(candidate: string, current: string) {
  const candidateParts = candidate.split(".").map(Number)
  const currentParts = current.split(".").map(Number)

  return candidateParts.some((part, index) => part !== currentParts[index] && part > (currentParts[index] ?? 0))
}

export async function GET() {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ images: [] }, { status: 503 })
  }

  const staticUrl = new URL("/rest/v1/static_augments", supabaseUrl)
  staticUrl.searchParams.set("select", "id,name_en,name_zh,icon_url")
  staticUrl.searchParams.set("icon_url", "not.is.null")

  const descriptionsUrl = new URL("/rest/v1/resg_augments", supabaseUrl)
  descriptionsUrl.searchParams.set("select", "augment_id,display_name,description,version")
  descriptionsUrl.searchParams.set("description", "not.is.null")

  const rankingUrl = new URL("/rest/v1/resg_cache", supabaseUrl)
  rankingUrl.searchParams.set("select", "payload")
  rankingUrl.searchParams.set("cache_key", "like.v2:augments:global:aram:%")
  rankingUrl.searchParams.set("order", "updated_at.desc")
  rankingUrl.searchParams.set("limit", "1")

  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  }
  const [staticResponse, descriptionsResponse, rankingResponse] = await Promise.all([
    fetch(staticUrl, { headers, next: { revalidate: 3600 } }),
    fetch(descriptionsUrl, { headers, next: { revalidate: 3600 } }),
    fetch(rankingUrl, { headers, next: { revalidate: 300 } }),
  ])

  if (!staticResponse.ok) {
    return NextResponse.json({ images: [] }, { status: 502 })
  }

  const augments = (await staticResponse.json()) as {
    id: number
    name_en: string
    name_zh: string
    icon_url: string | null
  }[]
  const descriptions = descriptionsResponse.ok
    ? ((await descriptionsResponse.json()) as {
        augment_id: number
        display_name: string
        description: string
        version: string
      }[])
    : []
  const rankings = rankingResponse.ok
    ? ((await rankingResponse.json()) as {
        payload: { id: number; matches: number; winRate: number; description?: string; imageUrl?: string }[]
      }[])[0]?.payload ?? []
    : []
  const latestDescriptions = new Map<number, { description: string; version: string }>()
  const latestDescriptionsByName = new Map<string, { description: string; version: string }>()
  const rankingById = new Map(rankings.map((ranking) => [ranking.id, ranking]))

  for (const description of descriptions) {
    const current = latestDescriptions.get(description.augment_id)
    if (!current || isNewerVersion(description.version, current.version)) {
      latestDescriptions.set(description.augment_id, description)
    }
    const currentByName = latestDescriptionsByName.get(description.display_name)
    if (!currentByName || isNewerVersion(description.version, currentByName.version)) {
      latestDescriptionsByName.set(description.display_name, description)
    }
  }

  return NextResponse.json(
    {
      images: augments.flatMap(({ id, name_en, name_zh, icon_url }) => {
        if (!icon_url) return []

        const ranking = rankingById.get(id)
        const description =
          ranking?.description ??
          latestDescriptions.get(id)?.description ??
          latestDescriptionsByName.get(name_zh)?.description
        return [
          {
            name: name_en,
            id,
            nameZh: name_zh,
            imageUrl:
              ranking?.imageUrl && !unavailableRankingImages.has(id)
                ? ranking.imageUrl
                : colorImageUrl(normalizeImageUrl(icon_url)),
            description: description ? descriptionText(description) : undefined,
            matches: ranking?.matches ?? null,
            winRate: ranking?.winRate ?? null,
          },
        ]
      }),
    },
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" } }
  )
}
