import { syncChampions } from "./sync-champions"
import { syncItems } from "./sync-items"
import { syncAugments } from "./sync-augments"
import { syncSummonerSpells } from "./sync-summoner-spells"
import { syncVersions } from "./sync-versions"
import { syncResgChampions } from "./sync-resg-champions"
import { syncResgAugments } from "./sync-resg-augments"
import { syncResgItems } from "./sync-resg-items"
import { syncResgSynergy } from "./sync-resg-synergy"
import { syncResgBaseStats } from "./sync-resg-base-stats"
import { supabase } from "../supabase"

export type { LangColumn } from "./helpers"

interface SyncResult {
  table: string
  count: number
  duration: number
}

export async function syncStatic(): Promise<SyncResult[]> {
  if (!supabase) throw new Error("Supabase not configured")
  const results: SyncResult[] = []
  const tasks: [string, () => Promise<number>][] = [
    ["static_champions", syncChampions],
    ["static_items", syncItems],
    ["static_augments", syncAugments],
    ["static_summoner_spells", syncSummonerSpells],
    ["game_versions", syncVersions],
  ]
  for (const [table, fn] of tasks) {
    const start = Date.now()
    const count = await fn()
    results.push({ table, count, duration: Date.now() - start })
  }
  return results
}

export async function syncResg(version: string, championIds?: number[]): Promise<SyncResult[]> {
  if (!supabase) throw new Error("Supabase not configured")
  const results: SyncResult[] = []

  const tasks: [string, () => Promise<number>][] = [
    ["resg_champion_stats", () => syncResgChampions(version)],
    ["resg_augments", () => syncResgAugments(version)],
    ["resg_items", () => syncResgItems(version)],
  ]
  for (const [table, fn] of tasks) {
    const start = Date.now()
    const count = await fn()
    results.push({ table, count, duration: Date.now() - start })
  }

  if (championIds && championIds.length > 0) {
    for (const championId of championIds) {
      const tasks: [string, () => Promise<number>][] = [
        ["resg_synergy", () => syncResgSynergy(version, championId)],
        ["resg_base_stats", () => syncResgBaseStats(version, championId)],
      ]
      for (const [table, fn] of tasks) {
        const start = Date.now()
        const count = await fn()
        results.push({ table: `${table}:${championId}`, count, duration: Date.now() - start })
      }
    }
  }

  return results
}

export async function syncAll(version: string, championIds?: number[]): Promise<SyncResult[]> {
  const staticResults = await syncStatic()
  const resgResults = await syncResg(version, championIds)
  return [...staticResults, ...resgResults]
}
