import { NextResponse } from "next/server"

const patches: Record<string, object> = {
  "25.14": { version: "25.14", releasedAt: "2026-07-09", summary: "年中大版本更新，多英雄平衡调整", championChanges: 23, itemChanges: 8, runeChanges: 3 },
  "25.13": { version: "25.13", releasedAt: "2026-06-25", summary: "装备系统小幅调整", championChanges: 12, itemChanges: 6, runeChanges: 1 },
  "25.12": { version: "25.12", releasedAt: "2026-06-11", summary: "新英雄上线，竞技场模式回归", championChanges: 5, itemChanges: 2, runeChanges: 4 },
  "25.11": { version: "25.11", releasedAt: "2026-05-28", summary: "大乱斗平衡补丁", championChanges: 18, itemChanges: 3, runeChanges: 0 },
  "25.10": { version: "25.10", releasedAt: "2026-05-14", summary: "MSI 版本，职业赛场影响补丁", championChanges: 15, itemChanges: 10, runeChanges: 2 },
}

export async function GET(_request: Request, { params }: { params: Promise<{ version: string }> }) {
  const version = (await params).version
  const patch = patches[version]
  if (!patch) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(patch, {
    headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=1200" },
  })
}
