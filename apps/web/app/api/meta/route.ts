import { NextResponse } from "next/server"

export async function GET() {
  const data = {
    topChampions: [
      { id: 1, name: "亚托克斯", alias: "暗裔剑魔", winRate: 0.543, pickRate: 0.085, matches: 15000 },
      { id: 2, name: "阿狸", alias: "九尾妖狐", winRate: 0.538, pickRate: 0.092, matches: 18000 },
      { id: 3, name: "凯特琳", alias: "皮城女警", winRate: 0.531, pickRate: 0.105, matches: 22000 },
    ],
    trendingUp: [
      { id: 7, name: "伊泽瑞尔", alias: "探险家", winRate: 0.521, pickRate: 0.11, matches: 14000, previousPatchDelta: 2.3 },
      { id: 4, name: "艾希", alias: "寒冰射手", winRate: 0.518, pickRate: 0.09, matches: 12000, previousPatchDelta: 1.8 },
      { id: 5, name: "布隆", alias: "弗雷尔卓德之心", winRate: 0.525, pickRate: 0.07, matches: 10000, previousPatchDelta: 1.5 },
    ],
    trendingDown: [
      { id: 10, name: "金克丝", alias: "暴走萝莉", winRate: 0.491, pickRate: 0.07, matches: 9000, previousPatchDelta: -2.1 },
      { id: 6, name: "德莱厄斯", alias: "诺克萨斯之手", winRate: 0.485, pickRate: 0.08, matches: 11000, previousPatchDelta: -1.7 },
    ],
    regionalDiff: [
      { championId: 1, name: "亚托克斯", diff: 3.5 },
      { championId: 7, name: "伊泽瑞尔", diff: -2.8 },
    ],
  }
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
  })
}
