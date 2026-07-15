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

  return slug
    ? `https://raw.communitydragon.org/latest/game/assets/ux/cherry/augments/icons/${slug}_large.png`
    : imageUrl
}

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
  staticUrl.searchParams.set("select", "id,name_en,icon_url")
  staticUrl.searchParams.set("icon_url", "not.is.null")

  const descriptionsUrl = new URL("/rest/v1/resg_augments", supabaseUrl)
  descriptionsUrl.searchParams.set("select", "augment_id,description,version")
  descriptionsUrl.searchParams.set("description", "not.is.null")

  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  }
  const [staticResponse, descriptionsResponse] = await Promise.all([
    fetch(staticUrl, { headers, next: { revalidate: 3600 } }),
    fetch(descriptionsUrl, { headers, next: { revalidate: 3600 } }),
  ])

  if (!staticResponse.ok) {
    return NextResponse.json({ images: [] }, { status: 502 })
  }

  const augments = (await staticResponse.json()) as { id: number; name_en: string; icon_url: string | null }[]
  const descriptions = descriptionsResponse.ok
    ? ((await descriptionsResponse.json()) as { augment_id: number; description: string; version: string }[])
    : []
  const latestDescriptions = new Map<number, { description: string; version: string }>()

  for (const description of descriptions) {
    const current = latestDescriptions.get(description.augment_id)
    if (!current || isNewerVersion(description.version, current.version)) {
      latestDescriptions.set(description.augment_id, description)
    }
  }

  return NextResponse.json(
    {
      images: augments.flatMap(({ id, name_en, icon_url }) => {
        if (!icon_url) return []

        const description = latestDescriptions.get(id)?.description
        return [
          {
            name: name_en,
            imageUrl: colorImageUrl(normalizeImageUrl(icon_url)),
            description: description ? descriptionText(description) : undefined,
          },
        ]
      }),
    },
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" } }
  )
}
