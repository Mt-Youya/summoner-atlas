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

const DEFAULT_PATCH = "25.14"

export const DATA_CONTEXT: DataContext = {
  region: "GLOBAL",
  mode: "aram",
  patch: DEFAULT_PATCH,
}

export function createDataContext(patch: string): DataContext {
  return { region: "GLOBAL", mode: "aram", patch }
}

export function isRegion(value: string | null | undefined): value is Region {
  return Boolean(value && REGIONS.includes(value as Region))
}

export function isGameMode(value: string | null | undefined): value is GameMode {
  return Boolean(value && GAME_MODES.includes(value as GameMode))
}
