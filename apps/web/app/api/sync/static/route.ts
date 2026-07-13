import { syncStatic } from "@summoner-atlas/data-access/sync"

export async function POST() {
  try {
    const results = await syncStatic()
    return Response.json({ ok: true, results })
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
