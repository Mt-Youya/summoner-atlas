import { supabase } from "../supabase"
import { fetchCDragon, cdnUrl, LOCALES, LANG_COLUMNS, langIndex } from "./helpers"

interface CDragonSummonerSpell {
  id: number
  name: string
  description: string
  iconPath: string
  cooldown: number
}

export async function syncSummonerSpells() {
  if (!supabase) throw new Error("Supabase not configured")

  const results = await Promise.all(
    LOCALES.map((locale) => fetchCDragon<CDragonSummonerSpell[]>(locale, "summoner-spells"))
  )

  const byId = new Map<
    number,
    Partial<Record<(typeof LANG_COLUMNS)[number], string>> & { icon_url: string | null; cooldown: number }
  >()

  for (let i = 0; i < results.length; i++) {
    const col = LANG_COLUMNS[langIndex(LOCALES[i])]
    for (const entry of results[i]) {
      // 跳过空名数据（id=5 等废弃召唤师技能）
      if (!entry.name) continue
      if (!byId.has(entry.id)) {
        byId.set(entry.id, {
          icon_url: cdnUrl(entry.iconPath),
          cooldown: entry.cooldown,
        })
      }
      const row = byId.get(entry.id)!
      ;(row as Record<string, unknown>)[`name_${col}`] = entry.name
      ;(row as Record<string, unknown>)[`description_${col}`] = entry.description
    }
  }

  const rows = Array.from(byId.entries()).map(([id, data]) => ({ id, ...data }))

  const { error } = await supabase.from("static_summoner_spells").upsert(rows, { onConflict: "id" })
  if (error) throw error
  return rows.length
}
