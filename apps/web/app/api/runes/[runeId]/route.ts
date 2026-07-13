import { NextResponse } from "next/server"

const runes: Record<number, object> = {
  1: { id: 1, name: "电刑", description: "3次攻击或技能命中造成额外伤害", path: "主宰", winRate: 0.531, pickRate: 0.28, matches: 18000, updatedAt: "2026-07-12" },
  2: { id: 2, name: "征服者", description: "攻击和技能叠加适应之力", path: "精密", winRate: 0.548, pickRate: 0.32, matches: 22000, updatedAt: "2026-07-12" },
  3: { id: 3, name: "黑暗收割", description: "低血量目标造成额外伤害并叠加", path: "主宰", winRate: 0.512, pickRate: 0.25, matches: 16000, updatedAt: "2026-07-12" },
}

export async function GET(_request: Request, { params }: { params: Promise<{ runeId: string }> }) {
  const id = Number((await params).runeId)
  const rune = runes[id]
  if (!rune) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(rune, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
  })
}
