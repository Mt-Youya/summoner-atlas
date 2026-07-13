export type Region = "CN" | "KR" | "NA" | "TW" | "EUW" | "EUNE" | "GLOBAL"

export const REGIONS: Region[] = ["CN", "KR", "NA", "TW", "EUW", "EUNE", "GLOBAL"]

export const regionLabels: Record<Region, string> = {
  CN: "国服",
  KR: "韩服",
  NA: "美服",
  TW: "台服",
  EUW: "欧服",
  EUNE: "北欧服",
  GLOBAL: "全球",
}

export const regionLabelsEn: Record<Region, string> = {
  CN: "CN",
  KR: "KR",
  NA: "NA",
  TW: "TW",
  EUW: "EUW",
  EUNE: "EUNE",
  GLOBAL: "Global",
}

export type GameMode = "summoners-rift" | "aram" | "arena"

export const GAME_MODES: GameMode[] = ["summoners-rift", "aram", "arena"]

export const modeLabels: Record<GameMode, string> = {
  "summoners-rift": "召唤师峡谷",
  aram: "大乱斗",
  arena: "竞技场",
}

export const modeLabelsEn: Record<GameMode, string> = {
  "summoners-rift": "Summoner's Rift",
  aram: "ARAM",
  arena: "Arena",
}

export interface DataContext {
  region: Region
  mode: GameMode
  patch: string
  tier?: string
  timeRange?: "24h" | "7d" | "30d"
}

export interface RankedMetric {
  winRate: number
  pickRate: number
  matches: number
  confidence: "low" | "medium" | "high"
  previousPatchDelta?: number
}

export type Confidence = RankedMetric["confidence"]

export const confidenceLabels: Record<Confidence, string> = {
  low: "低",
  medium: "中",
  high: "高",
}

export type Tier = "S" | "A" | "B" | "C" | "D"

export function classifyTier(winRate: number, pickRate: number): Tier {
  const score = winRate * 0.7 + pickRate * 0.3
  if (score >= 0.55) return "S"
  if (score >= 0.52) return "A"
  if (score >= 0.49) return "B"
  if (score >= 0.46) return "C"
  return "D"
}

export type AugmentQuality = "prismatic" | "gold" | "silver"

export const augmentQualityLabels: Record<AugmentQuality, string> = {
  prismatic: "棱彩",
  gold: "黄金",
  silver: "白银",
}

export function isRegion(value: string | null | undefined): value is Region {
  return Boolean(value && REGIONS.includes(value as Region))
}

export function isGameMode(value: string | null | undefined): value is GameMode {
  return Boolean(value && GAME_MODES.includes(value as GameMode))
}

export function isConfidence(value: string | null | undefined): value is Confidence {
  return value === "low" || value === "medium" || value === "high"
}
