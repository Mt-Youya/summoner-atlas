import { getChampions } from "@/lib/data"

export async function GET() {
  return Response.json(await getChampions(), {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  })
}
