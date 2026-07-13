import type { ChampionSummary, AugmentSummary, DataContext, RankedMetric } from "@summoner-atlas/domain"

export function createMockDataContext(overrides?: Partial<DataContext>): DataContext {
  return {
    region: "GLOBAL",
    mode: "aram",
    patch: "14.10",
    ...overrides,
  }
}

export function createMockChampion(overrides?: Partial<ChampionSummary>): ChampionSummary {
  return {
    id: 1,
    name: "亚托克斯",
    alias: "暗裔剑魔",
    winRate: 0.512,
    pickRate: 0.085,
    matches: 15000,
    tier: "A",
    ...overrides,
  }
}

export function createMockAugment(overrides?: Partial<AugmentSummary>): AugmentSummary {
  return {
    id: 1,
    name: "终极猎人",
    description: "你的终极技能获得额外技能急速",
    quality: "gold",
    winRate: 0.543,
    pickRate: 0.12,
    matches: 8000,
    ...overrides,
  }
}

export function createMockMetric(overrides?: Partial<RankedMetric>): RankedMetric {
  return {
    winRate: 0.52,
    pickRate: 0.08,
    matches: 10000,
    confidence: "high",
    ...overrides,
  }
}

export function createMockChampions(count: number): ChampionSummary[] {
  const names = ["亚托克斯", "阿狸", "阿卡丽", "艾希", "布隆", "凯特琳", "德莱厄斯", "伊泽瑞尔", "盖伦", "金克丝"]
  return Array.from({ length: count }, (_, i) =>
    createMockChampion({
      id: i + 1,
      name: names[i % names.length],
      winRate: 0.45 + Math.random() * 0.15,
      pickRate: 0.02 + Math.random() * 0.15,
      matches: 1000 + Math.floor(Math.random() * 20000),
      tier: ["S", "A", "B", "C", "D"][Math.floor(Math.random() * 5)] as ChampionSummary["tier"],
    })
  )
}

export function createMockAugments(count: number): AugmentSummary[] {
  const qualities: AugmentSummary["quality"][] = ["prismatic", "gold", "silver"]
  return Array.from({ length: count }, (_, i) =>
    createMockAugment({
      id: i + 1,
      quality: qualities[i % 3],
      winRate: 0.45 + Math.random() * 0.15,
      pickRate: 0.02 + Math.random() * 0.15,
      matches: 500 + Math.floor(Math.random() * 10000),
    })
  )
}
