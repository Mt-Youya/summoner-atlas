import { getAugment, getChampions } from "@/lib/data"

export async function GET(_: Request, { params }: { params: Promise<{ augmentId: string }> }) {
  const id = Number((await params).augmentId)
  if (!Number.isInteger(id)) return Response.json({ error: "海克斯编号无效" }, { status: 400 })
  const [augmentResult, championsResult] = await Promise.allSettled([getAugment(id), getChampions()])
  const augment = augmentResult.status === "fulfilled" ? augmentResult.value : null
  if (!augment) return Response.json({ error: "海克斯不存在" }, { status: 404 })
  const champions = championsResult.status === "fulfilled" ? championsResult.value : []
  return Response.json(
    { augment, champions },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  )
}
