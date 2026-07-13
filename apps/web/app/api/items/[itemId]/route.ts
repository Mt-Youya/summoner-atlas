import { NextResponse } from "next/server"

const items: Record<number, object> = {
  1: { id: 1, name: "卢登的伙伴", description: "技能命中造成额外伤害", winRate: 0.523, pickRate: 0.18, matches: 12000, updatedAt: "2026-07-12" },
  2: { id: 2, name: "中娅沙漏", description: "主动效果: 凝滞", winRate: 0.551, pickRate: 0.22, matches: 15000, updatedAt: "2026-07-12" },
  3: { id: 3, name: "灭世者的死亡之帽", description: "大幅提升法术强度", winRate: 0.568, pickRate: 0.15, matches: 10000, updatedAt: "2026-07-12" },
}

export async function GET(_request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const id = Number((await params).itemId)
  const item = items[id]
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
  })
}
