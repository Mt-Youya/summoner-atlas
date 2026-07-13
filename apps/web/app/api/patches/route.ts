import { NextResponse } from "next/server"
import { getPatches } from "@/lib/data"

export async function GET() {
  try {
    const patches = await getPatches()
    return NextResponse.json(patches, {
      headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=1200" },
    })
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
