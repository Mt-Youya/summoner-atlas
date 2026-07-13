import { supabase } from "../supabase"
import { fetchJSON } from "./helpers"

interface ResgChampionStat {
  champion_id: number
  total_matches: string
  avg_win_rate: string
}

export async function syncResgChampions(version: string) {
  if (!supabase) throw new Error("Supabase not configured")

  const stats = await fetchJSON<ResgChampionStat[]>(`https://api.resg.top/api/champions/stats?version=${version}`)

  const rows = stats.map((s) => ({
    version,
    champion_id: s.champion_id,
    total_matches: parseInt(s.total_matches, 10),
    avg_win_rate: parseFloat(s.avg_win_rate),
  }))

  const { error } = await supabase.from("resg_champion_stats").upsert(rows, { onConflict: "version,champion_id" })
  if (error) throw error
  return rows.length
}
