import { fetchCache, ok, serverError } from "../supabase"

const CDRAGON_CHAMP =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons"

export async function GET(req: Request) {
  const payload = (await fetchCache("v2:champions:global:aram:16.13")) as Record<string, unknown>[] | null
  if (!payload) return serverError()

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")?.toLowerCase()
  const limit = Number(searchParams.get("limit")) || undefined
  const sort = searchParams.get("sort") || "winRate"

  let champions = payload.map((c: Record<string, unknown>) => ({
    id: c.alias as string,
    numericId: c.id as number,
    name: c.alias as string,
    nameZh: c.name as string,
    imageUrl: (c.imageUrl as string) || `${CDRAGON_CHAMP}/${c.id}.png`,
    winRate: (c.winRate as number) * 100,
    matches: c.matches as number,
  }))

  if (search) {
    champions = champions.filter((c) => c.name.toLowerCase().includes(search) || c.nameZh.includes(search))
  }

  const sortKey = sort.startsWith("-") ? sort.slice(1) : sort
  const desc = sort.startsWith("-") ? -1 : 1
  champions.sort((a, b) => {
    const va = ((a as Record<string, unknown>)[sortKey] as number) ?? 0
    const vb = ((b as Record<string, unknown>)[sortKey] as number) ?? 0
    return (va - vb) * desc
  })

  const total = champions.length
  if (limit) champions = champions.slice(0, limit)

  return ok(champions, { total, version: "16.13" })
}
