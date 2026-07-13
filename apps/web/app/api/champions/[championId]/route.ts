import { getAugments, getChampion, getChampionCombos, getChampionSynergy } from "@/lib/data"

export async function GET(_: Request, { params }: { params: Promise<{ championId: string }> }) {
  const id = Number((await params).championId)
  if (!Number.isInteger(id)) return Response.json({ error: "Invalid champion ID" }, { status: 400 })
  const [championResult, combosResult, synergyResult, augmentsResult] = await Promise.allSettled([
    getChampion(id),
    getChampionCombos(id),
    getChampionSynergy(id),
    getAugments(),
  ])
  const champion = championResult.status === "fulfilled" ? championResult.value : null
  if (!champion) return Response.json({ error: "Champion not found" }, { status: 404 })
  const combos = combosResult.status === "fulfilled" ? combosResult.value : []
  const synergy = synergyResult.status === "fulfilled" ? synergyResult.value : []
  const augments = augmentsResult.status === "fulfilled" ? augmentsResult.value : []
  return Response.json(
    { champion, combos, synergy, augments },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  )
}
