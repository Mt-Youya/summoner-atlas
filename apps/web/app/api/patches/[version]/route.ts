import { NextResponse } from "next/server"
import { getPatches } from "@/lib/data"

export async function GET(_request: Request, { params }: { params: Promise<{ version: string }> }) {
  try {
    const version = (await params).version
    const patches = await getPatches()
    const patch = patches.find((p) => p.version === version)
    if (!patch) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(patch, {
      headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=1200" },
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch patch" }, { status: 500 })
  }
}
