import { supabase } from "../supabase"
import { fetchJSON } from "./helpers"

interface ResgAugment {
  id: number
  display_name: string
  description: string
  tooltip: string
}

export async function syncResgAugments(version: string) {
  if (!supabase) throw new Error("Supabase not configured")

  const augments = await fetchJSON<ResgAugment[]>(`https://api.resg.top/api/augments?version=${version}`)

  const rows = augments.map((a) => ({
    version,
    augment_id: a.id,
    display_name: a.display_name,
    description: a.description,
    tooltip: a.tooltip ?? null,
  }))

  const { error } = await supabase.from("resg_augments").upsert(rows, { onConflict: "version,augment_id" })
  if (error) throw error
  return rows.length
}
