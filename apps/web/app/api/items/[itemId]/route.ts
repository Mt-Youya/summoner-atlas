import { NextResponse } from "next/server"
import { getItems } from "@/lib/data"

export async function GET(_request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const id = Number((await params).itemId)
    const items = await getItems()
    const item = items.find((i) => i.id === id)
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(item, {
      headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 })
  }
}
