import { NextResponse } from "next/server"
import { getRunes } from "@/lib/data"

export async function GET(_request: Request, { params }: { params: Promise<{ runeId: string }> }) {
  try {
    const id = Number((await params).runeId)
    const runes = await getRunes()
    const rune = runes.find((r) => r.id === id)
    if (!rune) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(rune, {
      headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch rune" }, { status: 500 })
  }
}
