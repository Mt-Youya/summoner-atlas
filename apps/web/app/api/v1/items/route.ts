import { fetchCache, ok, serverError } from "../supabase"

export async function GET() {
  const payload = (await fetchCache("items:global:aram:latest")) as Record<string, unknown>[] | null
  if (!payload) return serverError()

  const items = payload.map((item: Record<string, unknown>) => ({
    id: item.id as number,
    name: item.name as string,
    imageUrl: item.imageUrl as string,
    description: item.description as string,
    winRate: (item.winRate as number) * 100,
    pickRate: (item.pickRate as number) * 100,
    matches: item.matches as number,
  }))

  return ok(items, { total: items.length })
}
