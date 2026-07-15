import { fetchCache, ok, serverError } from "../supabase"

export async function GET() {
  const payload = (await fetchCache("runes:global:aram:latest")) as Record<string, unknown>[] | null
  if (!payload) return serverError()

  const runes = payload.map((rune: Record<string, unknown>) => ({
    id: rune.id as number,
    name: rune.name as string,
    path: rune.path as string,
    imageUrl: rune.imageUrl as string,
    description: rune.description as string,
    winRate: (rune.winRate as number) * 100,
    pickRate: (rune.pickRate as number) * 100,
    matches: rune.matches as number,
  }))

  return ok(runes, { total: runes.length })
}
