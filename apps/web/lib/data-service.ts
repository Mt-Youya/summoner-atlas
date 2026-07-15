export interface Champion {
  id: string
  name: string
  nameZh: string
  aliases: string[]
  avatarUrl: string
  splashUrl: string
}

export interface Augment {
  id: string
  name: string
  nameZh: string
  description: string
  iconUrl: string
}

export interface PatchSummary {
  version: string
  publishDate: string
  totalSamples: number
  lastUpdated: string
}

export interface ChampionRank {
  champion: Champion
  winRate: number
  pickRate: number
  matches: number
  confidence: "high" | "medium" | "low"
  rank: number
}

export interface ChampionTrend {
  champion: Champion
  winRateChange: number
  currentWinRate: number
}

export interface AugmentRank {
  augment: Augment
  winRate: number
  matches: number
  suitableChampions: Champion[]
}

export interface ChampionSearchResult {
  champion: Champion
  winRate: number
  matches: number
  confidence: "high" | "medium" | "low"
}

export interface BuildRecommendation {
  skillOrder: string[]
  coreItems: { name: string; iconUrl: string }[]
  runes: { primaryPath: string; secondaryPath: string; keystone: string }
}

export interface AugmentCombo {
  augment: Augment
  synergyScore: number
  matches: number
}

export interface ChampionDetail {
  champion: Champion
  winRate: number
  pickRate: number
  matches: number
  confidence: "high" | "medium" | "low"
  build: BuildRecommendation
  topAugmentCombos: AugmentCombo[]
  trendData: { patch: string; winRate: number }[]
}

export interface AtlasGraphNode {
  id: string
  name: string
  type: "champion" | "augment"
  imageUrl: string
  x: number
  y: number
  size: number
}

export interface AtlasGraphLink {
  source: string
  target: string
  strength: number
}

export interface AtlasGraphData {
  nodes: AtlasGraphNode[]
  links: AtlasGraphLink[]
}

export type GameMode = "aram" | "summonersRift" | "arena" | "tft"
export type Region = "cn" | "kr" | "global"

export interface AugmentDetail {
  augment: Augment
  winRate: number
  pickRate: number
  matches: number
  confidence: "high" | "medium" | "low"
  suitableChampions: { champion: Champion; synergyScore: number }[]
  trendData: { patch: string; winRate: number }[]
}

export interface DataService {
  getPatchSummary(): Promise<PatchSummary>
  getTopChampions(params: { mode: GameMode; region: Region; limit: number }): Promise<ChampionRank[]>
  getTrendingChampions(params: {
    mode: GameMode
    region: Region
  }): Promise<{ up: ChampionTrend[]; down: ChampionTrend[] }>
  getTopAugments(params: { mode: GameMode; limit: number }): Promise<AugmentRank[]>
  getAugmentDetail(params: { id: string; mode: GameMode }): Promise<AugmentDetail>
  searchChampions(params: { query: string; mode: GameMode }): Promise<ChampionSearchResult[]>
  getChampionDetail(params: { id: string; mode: GameMode }): Promise<ChampionDetail>
  getAtlasPreview(params: { mode: GameMode }): Promise<AtlasGraphData>
}
