const CDRAGON_BASE = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global"
export const CDRAGON_ASSETS = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default"

export const LOCALES = ["zh_cn", "default", "ko_kr"] as const
export const LANG_COLUMNS = ["zh", "en", "ko"] as const
export type LangColumn = (typeof LANG_COLUMNS)[number]

export function cdnUrl(relativePath: string | undefined | null): string | null {
  if (!relativePath) return null
  return `${CDRAGON_ASSETS}${relativePath}`
}

export function langIndex(locale: string): number {
  if (locale === "zh_cn") return 0
  if (locale === "default") return 1
  return 2
}

export async function fetchCDragon<T>(locale: string, resource: string): Promise<T> {
  const url = `${CDRAGON_BASE}/${locale}/v1/${resource}.json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`CDragon fetch failed: ${url} ${res.status}`)
  return res.json()
}

export async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Fetch failed: ${url} ${res.status}`)
  return res.json()
}
