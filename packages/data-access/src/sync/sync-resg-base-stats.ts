import { supabase } from "../supabase"
import { fetchJSON } from "./helpers"

interface ResgBaseStatEntry {
  game_version: string
  champion_id: number
  spells: number[]
  boots_id: number
  max_order: string
  total_matches: string
  win_rate: string
}

export async function syncResgBaseStats(version: string, championId: number) {
  if (!supabase) throw new Error("Supabase not configured")

  const baseStats = await fetchJSON<{ combos: ResgBaseStatEntry[] }>(
    `https://api.resg.top/api/base-stats?championId=${championId}&version=${version}`
  )

  const rows = baseStats.combos.map((s) => ({
    version,
    champion_id: s.champion_id,
    spells: s.spells,
    boots_id: s.boots_id,
    max_order: s.max_order,
    total_matches: parseInt(s.total_matches, 10),
    win_rate: parseFloat(s.win_rate),
  }))

  const { error } = await supabase
    .from("resg_base_stats")
    .upsert(rows, { onConflict: "version,champion_id,spells,boots_id" })
  if (error) throw error
  return rows.length
}
