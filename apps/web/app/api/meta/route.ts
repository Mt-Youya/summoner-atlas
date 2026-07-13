import { NextResponse } from "next/server"
import { getChampions } from "@/lib/data"

export async function GET() {
  try {
    const champions = await getChampions()
    const sorted = champions.toSorted((a, b) => b.winRate - a.winRate)
    const highSample = champions.filter((c) => c.matches >= 1000)

    const trendingUp = highSample.toSorted((a, b) => b.winRate - a.winRate).slice(0, 10)

    const trendingDown = highSample.toSorted((a, b) => a.winRate - b.winRate).slice(0, 10)

    const regionalDiff: { championId: number; name: string; diff: number }[] = []

    return NextResponse.json(
      {
        topChampions: sorted.slice(0, 5),
        trendingUp,
        trendingDown,
        regionalDiff,
      },
      {
        headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
      }
    )
  } catch {
    return NextResponse.json({ error: "Failed to fetch meta data" }, { status: 500 })
  }
}
