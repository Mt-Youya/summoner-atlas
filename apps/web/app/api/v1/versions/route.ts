import { headers, supabaseUrl, ok, serverError } from "../supabase"

export async function GET() {
  const url = new URL("/rest/v1/game_versions", supabaseUrl!)
  url.searchParams.set("select", "version,created_at")
  url.searchParams.set("order", "created_at.desc")

  const res = await fetch(url, { headers, next: { revalidate: 3600 } })
  if (!res.ok) return serverError()

  const versions = (await res.json()) as { version: string; created_at: string }[]

  return ok(versions, { total: versions.length })
}
