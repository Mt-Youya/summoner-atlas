import { getAugments } from "@/lib/data"

export async function GET() {
  return Response.json(await getAugments(), {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  })
}
