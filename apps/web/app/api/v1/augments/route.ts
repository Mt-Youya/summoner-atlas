import { headers, supabaseUrl, fetchCache, ok, serverError } from "../supabase"

export async function GET(req: Request) {
  // Fetch v2 augment cache + static English names in parallel
  const [payload, enNames] = await Promise.all([
    fetchCache("v2:augments:global:aram:16.13") as Promise<Record<string, unknown>[] | null>,
    (async () => {
      const url = new URL("/rest/v1/static_augments", supabaseUrl!)
      url.searchParams.set("select", "id,name_en")
      const res = await fetch(url, { headers, next: { revalidate: 3600 } })
      if (!res.ok) return new Map<string, string>()
      const rows = (await res.json()) as { id: number; name_en: string }[]
      return new Map(rows.map((r) => [String(r.id), r.name_en]))
    })(),
  ])

  if (!payload) return serverError()

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")?.toLowerCase()
  const limit = Number(searchParams.get("limit")) || undefined

  let augments = payload.map((a: Record<string, unknown>) => ({
    id: String(a.id),
    name: (enNames.get(String(a.id)) ?? a.name) as string,
    nameZh: a.name as string,
    imageUrl: a.imageUrl as string,
    description: a.description as string,
    winRate: (a.winRate as number) * 100,
    matches: a.matches as number,
  }))

  if (search) {
    augments = augments.filter(
      (a) =>
        a.name.toLowerCase().includes(search) ||
        a.nameZh.includes(search) ||
        a.description?.toLowerCase().includes(search)
    )
  }

  const total = augments.length
  if (limit) augments = augments.slice(0, limit)

  return ok(augments, { total, version: "16.13" })
}
