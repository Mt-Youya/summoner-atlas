import { supabase } from "../supabase"
import { fetchCDragon, cdnUrl, LOCALES, LANG_COLUMNS, langIndex } from "./helpers"

interface CDragonItem {
  id: number
  name: string
  description: string
  iconPath: string
  price: number
  price_total: number
  categories: string[]
}

export async function syncItems() {
  if (!supabase) throw new Error("Supabase not configured")

  const results = await Promise.all(LOCALES.map((locale) => fetchCDragon<CDragonItem[]>(locale, "items")))

  const byId = new Map<
    number,
    Partial<Record<(typeof LANG_COLUMNS)[number], string>> & {
      icon_url: string | null
      price: number
      price_total: number
      categories: string[]
    }
  >()

  for (let i = 0; i < results.length; i++) {
    const col = LANG_COLUMNS[langIndex(LOCALES[i])]
    for (const entry of results[i]) {
      if (!byId.has(entry.id)) {
        byId.set(entry.id, {
          icon_url: cdnUrl(entry.iconPath),
          price: entry.price,
          price_total: entry.price_total,
          categories: entry.categories ?? [],
        })
      }
      const row = byId.get(entry.id)!
      ;(row as Record<string, unknown>)[`name_${col}`] = entry.name
      ;(row as Record<string, unknown>)[`description_${col}`] = entry.description
    }
  }

  const rows = Array.from(byId.entries()).map(([id, data]) => ({ id, ...data }))

  const { error } = await supabase.from("static_items").upsert(rows, { onConflict: "id" })
  if (error) throw error
  return rows.length
}
