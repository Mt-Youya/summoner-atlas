// Next.js auto-loads .env from project root. This fallback covers edge cases
// where runtime cwd differs (e.g. monorepo tooling). No-op in production/Vercel.
try {
  if (!process.env.SUMMONER_ATLAS_SUPABASE_URL) {
    process.loadEnvFile(".env")
  }
} catch {}

export const supabaseUrl =
  process.env.SUPABASE_URL ??
  process.env.SUMMONER_ATLAS_SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUMMONER_ATLAS_SUPABASE_SUMMONER_ATLAS_SUPABASE_URL

export const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUMMONER_ATLAS_SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUMMONER_ATLAS_SUPABASE_SECRET_KEY

export const headers = {
  apikey: serviceRoleKey!,
  Authorization: `Bearer ${serviceRoleKey}`,
}

export async function fetchCache(key: string) {
  const url = new URL("/rest/v1/resg_cache", supabaseUrl!)
  url.searchParams.set("select", "payload")
  url.searchParams.set("cache_key", `eq.${key}`)
  const res = await fetch(url, { headers, next: { revalidate: 300 } })
  if (!res.ok) return null
  const [row] = (await res.json()) as { payload: Record<string, unknown>[] }[]
  return row?.payload ?? null
}

export function ok(data: unknown, meta?: Record<string, unknown>) {
  return Response.json(
    { data, meta: meta ?? {} },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } }
  )
}

export function notFound() {
  return Response.json({ error: "Not found" }, { status: 404 })
}

export function serverError() {
  return Response.json({ error: "Service unavailable" }, { status: 503 })
}
