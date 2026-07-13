import { NextResponse } from "next/server"
import { getItems } from "@/lib/data"

export async function GET() {
  try {
    const items = await getItems()
    return NextResponse.json(items, {
      headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
    })
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
