import { supabase } from "../supabase"
import { fetchJSON } from "./helpers"

interface ResgSynergyEntry {
  combo_type: string
  combo_key: string
  tier_signature: string
  total_matches: number
  win_rate: number
  builds: { items: number[]; total_matches: number; win_rate: number }[]
}

export async function syncResgSynergy(version: string, championId: number) {
  if (!supabase) throw new Error("Supabase not configured")

  const synergy = await fetchJSON<ResgSynergyEntry[]>(
    `https://api.resg.top/api/synergy?championId=${championId}&version=${version}&tier=ALL&top=15&buildLimit=5`
  )

  const rows = synergy.map((s) => ({
    version,
    champion_id: championId,
    combo_type: s.combo_type,
    combo_key: s.combo_key,
    total_matches: s.total_matches,
    win_rate: s.win_rate,
    builds: s.builds,
  }))

  const { error } = await supabase.from("resg_synergy").upsert(rows, { onConflict: "version,champion_id,combo_key" })
  if (error) throw error
  return rows.length
}
