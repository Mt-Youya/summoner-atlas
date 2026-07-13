import { syncAll } from "@summoner-atlas/data-access/sync"

export async function POST(request: Request) {
  try {
    const { version, championIds } = await request.json()
    if (!version) return Response.json({ ok: false, error: "version required" }, { status: 400 })
    const results = await syncAll(version, championIds)
    return Response.json({ ok: true, results })
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
