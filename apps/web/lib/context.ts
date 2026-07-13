export const SUPPORTED_REGION = "GLOBAL" as const
export const SUPPORTED_MODE = "aram" as const

export type Region = typeof SUPPORTED_REGION
export type GameMode = typeof SUPPORTED_MODE

export interface DataContext {
  region: Region
  mode: GameMode
  patch: string
}

export function createDataContext(patch: string): DataContext {
  return { region: SUPPORTED_REGION, mode: SUPPORTED_MODE, patch }
}

export const contextLabels = {
  region: "全球公开样本",
  mode: "大乱斗",
} as const
