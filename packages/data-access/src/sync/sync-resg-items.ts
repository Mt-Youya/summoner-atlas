import { supabase } from "../supabase"
import { fetchJSON } from "./helpers"

interface ResgItem {
  item_id: number
  name: string
  description: string
}

export async function syncResgItems(version: string) {
  if (!supabase) throw new Error("Supabase not configured")

  const items = await fetchJSON<ResgItem[]>(`https://api.resg.top/api/items?version=${version}`)

  const rows = items.map((i) => ({
    version,
    item_id: i.item_id,
    name: i.name,
    description: i.description,
  }))

  const { error } = await supabase.from("resg_items").upsert(rows, { onConflict: "version,item_id" })
  if (error) throw error
  return rows.length
}
