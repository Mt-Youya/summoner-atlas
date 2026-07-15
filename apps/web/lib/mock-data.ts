import type { Augment, Champion, DataService } from "./data-service"

type ChampionCatalogEntry = {
  id: number
  alias: string
  nameZh: string
  name: string
  imageUrl: string
  matches: number | null
  winRate: number | null
}

type AugmentCatalogEntry = {
  id: number
  nameZh: string
  name: string
  imageUrl: string
  description?: string
  matches: number | null
  winRate: number | null
}

let champions: Champion[] = []
let augments: Augment[] = []
let championStats = new Map<string, { matches: number; winRate: number }>()
let augmentStats = new Map<string, { matches: number; winRate: number }>()
let championCatalogPromise: Promise<void> | undefined
let augmentCatalogPromise: Promise<void> | undefined

function normalizeId(value: string) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]/g, "")
}

async function hydrateChampionCatalog() {
  championCatalogPromise ??= fetch("/api/champion-images")
    .then(async (response) =>
      response.ok ? ((await response.json()) as { champions: ChampionCatalogEntry[] }).champions : []
    )
    .then((entries) => {
      champions = entries.map((entry) => ({
        id: normalizeId(entry.alias),
        name: entry.name,
        nameZh: entry.nameZh,
        aliases: [entry.alias, entry.name, entry.nameZh],
        avatarUrl: entry.imageUrl,
        splashUrl: entry.imageUrl,
      }))
      championStats = new Map(
        entries.flatMap((entry) =>
          entry.matches !== null && entry.winRate !== null
            ? [[normalizeId(entry.alias), { matches: entry.matches, winRate: entry.winRate }] as const]
            : []
        )
      )
    })
    .catch(() => undefined)

  await championCatalogPromise
}

async function hydrateAugmentCatalog() {
  augmentCatalogPromise ??= fetch("/api/augment-images")
    .then(async (response) =>
      response.ok ? ((await response.json()) as { images: AugmentCatalogEntry[] }).images : []
    )
    .then((entries) => {
      augments = entries.map((entry) => ({
        id: String(entry.id),
        name: entry.name,
        nameZh: entry.nameZh,
        description: entry.description ?? "",
        iconUrl: entry.imageUrl,
      }))
      augmentStats = new Map(
        entries.flatMap((entry) =>
          entry.matches !== null && entry.winRate !== null
            ? [[String(entry.id), { matches: entry.matches, winRate: entry.winRate }] as const]
            : []
        )
      )
    })
    .catch(() => undefined)

  await augmentCatalogPromise
}

function championById(id: string) {
  const champion = champions.find((entry) => entry.id === id)
  if (!champion) throw new Error(`Unknown champion: ${id}`)
  return champion
}

function augmentById(id: string) {
  const augment = augments.find((entry) => entry.id === id)
  if (!augment) throw new Error(`Unknown augment: ${id}`)
  return augment
}

function rankedChampions() {
  return champions
    .flatMap((champion) => {
      const stats = championStats.get(champion.id)
      return stats ? [{ champion, ...stats }] : []
    })
    .toSorted((a, b) => b.winRate - a.winRate || b.matches - a.matches)
}

export const mockDataService: DataService = {
  async getPatchSummary() {
    await hydrateChampionCatalog()
    const versions = await fetch("/api/game-versions")
      .then(async (response) =>
        response.ok ? ((await response.json()) as { versions: { version: string; created_at: string }[] }).versions : []
      )
      .catch(() => [])
    const latest = versions[0]
    return {
      version: latest?.version ?? "",
      publishDate: latest?.created_at ?? "",
      totalSamples: [...championStats.values()].reduce((total, stat) => total + stat.matches, 0),
      lastUpdated: latest?.created_at ?? "",
    }
  },

  async getTopChampions({ limit }) {
    await hydrateChampionCatalog()
    return rankedChampions()
      .slice(0, limit)
      .map((entry, index) => ({
        champion: entry.champion,
        winRate: entry.winRate * 100,
        matches: entry.matches,
        confidence: entry.matches >= 30_000 ? ("high" as const) : ("medium" as const),
        rank: index + 1,
      }))
  },

  async getTrendingChampions() {
    await hydrateChampionCatalog()
    return { up: [], down: [] }
  },

  async getTopAugments({ limit }) {
    await Promise.all([hydrateChampionCatalog(), hydrateAugmentCatalog()])
    return augments
      .flatMap((augment) => {
        const stats = augmentStats.get(augment.id)
        return stats ? [{ augment, ...stats }] : []
      })
      .toSorted((a, b) => b.winRate - a.winRate || b.matches - a.matches)
      .slice(0, limit)
      .map((entry) => ({
        augment: entry.augment,
        winRate: entry.winRate * 100,
        matches: entry.matches,
        suitableChampions: [],
      }))
  },

  async searchChampions({ query }) {
    await hydrateChampionCatalog()
    const normalizedQuery = query.trim().toLowerCase()
    return champions
      .filter(
        (champion) =>
          champion.name.toLowerCase().includes(normalizedQuery) ||
          champion.nameZh.includes(query.trim()) ||
          champion.aliases.some((alias) => alias.toLowerCase().includes(normalizedQuery))
      )
      .map((champion) => {
        const stats = championStats.get(champion.id)
        return {
          champion,
          winRate: stats?.winRate ? stats.winRate * 100 : 0,
          matches: stats?.matches ?? 0,
          confidence: stats && stats.matches >= 30_000 ? ("high" as const) : ("low" as const),
        }
      })
  },

  async getChampionDetail({ id }) {
    await Promise.all([hydrateChampionCatalog(), hydrateAugmentCatalog()])
    const champion = championById(id)
    const stats = championStats.get(champion.id)
    return {
      champion,
      winRate: (stats?.winRate ?? 0) * 100,
      matches: stats?.matches ?? 0,
      confidence: stats && stats.matches >= 30_000 ? ("high" as const) : ("low" as const),
      build: {
        skillOrder: [],
        coreItems: [],
        runes: { primaryPath: "", secondaryPath: "", keystone: "" },
      },
      topAugmentCombos: [],
      trendData: [],
    }
  },

  async getAugmentDetail({ id }) {
    await Promise.all([hydrateChampionCatalog(), hydrateAugmentCatalog()])
    const augment = augmentById(id)
    const stats = augmentStats.get(augment.id)
    return {
      augment,
      winRate: (stats?.winRate ?? 0) * 100,
      matches: stats?.matches ?? 0,
      confidence: "low" as const,
      suitableChampions: [],
      trendData: [],
    }
  },

  async getAtlasPreview() {
    await Promise.all([hydrateChampionCatalog(), hydrateAugmentCatalog()])
    const atlasChampions = rankedChampions().slice(0, 24).map((entry) => entry.champion)
    const atlasAugments = augments.filter((augment) => augment.description).slice(0, 16)
    const nodes = [
      ...atlasChampions.map((champion, index) => ({
        id: champion.id,
        name: champion.nameZh,
        type: "champion" as const,
        imageUrl: champion.avatarUrl,
        x: 10 + (index % 6) * 16,
        y: 12 + Math.floor(index / 6) * 22,
        size: 18,
      })),
      ...atlasAugments.map((augment, index) => ({
        id: augment.id,
        name: augment.nameZh,
        type: "augment" as const,
        imageUrl: augment.iconUrl,
        x: 12 + (index % 8) * 11,
        y: 18 + Math.floor(index / 8) * 54,
        size: 16,
      })),
    ]
    return { nodes, links: [] }
  },
}
