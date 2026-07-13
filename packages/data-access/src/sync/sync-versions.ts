import { supabase } from "../supabase"
import { fetchJSON } from "./helpers"

export async function syncVersions() {
  if (!supabase) throw new Error("Supabase not configured")

  const versions = await fetchJSON<string[]>("https://ddragon.leagueoflegends.com/api/versions.json")

  const rows = versions.map((version) => ({ version }))

  const { error } = await supabase.from("game_versions").upsert(rows, { onConflict: "version" })
  if (error) throw error
  return rows.length
}
