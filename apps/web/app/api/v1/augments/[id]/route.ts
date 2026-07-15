import { headers, supabaseUrl, fetchCache, ok, notFound } from "../../supabase"

function normalizePath(path: string) {
  if (!path) return ""
  const assetIdx = path.indexOf("/assets/")
  if (assetIdx < 0) return path
  return path.slice(assetIdx).toLowerCase()
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch augment static data
  const staticUrl = new URL("/rest/v1/static_augments", supabaseUrl!)
  staticUrl.searchParams.set("select", "id,name_en,name_zh,icon_url")
  staticUrl.searchParams.set("id", `eq.${id}`)
  const staticRes = await fetch(staticUrl, { headers, next: { revalidate: 3600 } })
  const staticData = staticRes.ok
    ? ((await staticRes.json()) as { id: number; name_en: string; name_zh: string; icon_url: string }[])
    : []

  // Fetch augment description
  const descUrl = new URL("/rest/v1/resg_augments", supabaseUrl!)
  descUrl.searchParams.set("select", "description,version")
  descUrl.searchParams.set("augment_id", `eq.${id}`)
  descUrl.searchParams.set("order", "version.desc")
  descUrl.searchParams.set("limit", "1")
  const descRes = await fetch(descUrl, { headers, next: { revalidate: 3600 } })
  const descData = descRes.ok ? ((await descRes.json()) as { description: string; version: string }[]) : []

  // Fetch augment ranking from cache
  const rankings = (await fetchCache("v2:augments:global:aram:16.13")) as Record<string, unknown>[] | null
  const rank = rankings?.find((r) => String(r.id) === id)

  const augment = staticData[0]
  if (!augment && !rank) return notFound()

  return ok(
    {
      id,
      name: augment?.name_en ?? rank?.name ?? id,
      nameZh: augment?.name_zh ?? rank?.name ?? id,
      imageUrl: rank?.imageUrl ?? (augment?.icon_url ? normalizePath(augment.icon_url) : ""),
      description: rank?.description ?? descData[0]?.description ?? "",
      winRate: rank ? (rank.winRate as number) * 100 : null,
      matches: rank?.matches ?? null,
    },
    { version: "16.13" }
  )
}
