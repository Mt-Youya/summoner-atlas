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

export async function GET() {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ images: [] }, { status: 503 })
  }

  const url = new URL("/rest/v1/static_champions", supabaseUrl)
  url.searchParams.set("select", "alias,image_url")
  url.searchParams.set("image_url", "not.is.null")

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

  const images = (await response.json()) as { alias: string; image_url: string | null }[]
  return NextResponse.json(
    {
      images: images.flatMap(({ alias, image_url }) => (image_url ? [{ alias, imageUrl: image_url }] : [])),
    },
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" } }
  )
}
