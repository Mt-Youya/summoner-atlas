import type { DataContext, Region, GameMode } from "@summoner-atlas/domain"

const BASE_URL = "/api"

export interface ChampionSummary {
  id: number
  name: string
  alias: string
  winRate: number
  pickRate: number
  matches: number
  tier: string
  previousPatchDelta?: number
}

export interface AugmentSummary {
  id: number
  name: string
  description: string
  quality: string
  winRate: number
  pickRate: number
  matches: number
}

export interface ItemSummary {
  id: number
  name: string
  description: string
  winRate: number
  pickRate: number
  matches: number
}

export interface RuneSummary {
  id: number
  name: string
  description: string
  path: string
  winRate: number
  pickRate: number
  matches: number
}

export interface PatchInfo {
  version: string
  releasedAt: string
  summary: string
  championChanges: number
  itemChanges: number
  runeChanges: number
}

async function fetchJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  return response.json()
}

export function fetchChampions(signal?: AbortSignal) {
  return fetchJSON<ChampionSummary[]>(`${BASE_URL}/champions`, signal)
}

export function fetchChampion(id: number, signal?: AbortSignal) {
  return fetchJSON<ChampionSummary & { combos: unknown[]; synergy: unknown[]; augments: unknown[] }>(
    `${BASE_URL}/champions/${id}`,
    signal
  )
}

export function fetchAugments(signal?: AbortSignal) {
  return fetchJSON<AugmentSummary[]>(`${BASE_URL}/augments`, signal)
}

export function fetchAugment(id: number, signal?: AbortSignal) {
  return fetchJSON<AugmentSummary & { champions: unknown[] }>(`${BASE_URL}/augments/${id}`, signal)
}

export function fetchItems(context: DataContext, signal?: AbortSignal) {
  const params = new URLSearchParams({ region: context.region, mode: context.mode, patch: context.patch })
  return fetchJSON<ItemSummary[]>(`${BASE_URL}/items?${params}`, signal)
}

export function fetchItem(id: number, context: DataContext, signal?: AbortSignal) {
  const params = new URLSearchParams({ region: context.region, mode: context.mode, patch: context.patch })
  return fetchJSON<ItemSummary>(`${BASE_URL}/items/${id}?${params}`, signal)
}

export function fetchRunes(context: DataContext, signal?: AbortSignal) {
  const params = new URLSearchParams({ region: context.region, mode: context.mode, patch: context.patch })
  return fetchJSON<RuneSummary[]>(`${BASE_URL}/runes?${params}`, signal)
}

export function fetchRune(id: number, context: DataContext, signal?: AbortSignal) {
  const params = new URLSearchParams({ region: context.region, mode: context.mode, patch: context.patch })
  return fetchJSON<RuneSummary>(`${BASE_URL}/runes/${id}?${params}`, signal)
}

export function fetchPatches(region: Region, signal?: AbortSignal) {
  return fetchJSON<PatchInfo[]>(`${BASE_URL}/patches?region=${region}`, signal)
}

export function fetchPatch(version: string, region: Region, signal?: AbortSignal) {
  return fetchJSON<PatchInfo>(`${BASE_URL}/patches/${version}?region=${region}`, signal)
}

export function fetchMeta(context: DataContext, signal?: AbortSignal) {
  const params = new URLSearchParams({ region: context.region, mode: context.mode, patch: context.patch })
  return fetchJSON<{
    topChampions: ChampionSummary[]
    trendingUp: ChampionSummary[]
    trendingDown: ChampionSummary[]
    regionalDiff: { championId: number; name: string; diff: number }[]
  }>(`${BASE_URL}/meta?${params}`, signal)
}
