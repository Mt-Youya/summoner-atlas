import { NextResponse } from "next/server"
import { getRunes } from "@/lib/data"

export async function GET() {
  try {
    const runes = await getRunes()
    return NextResponse.json(runes, {
      headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
    })
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
