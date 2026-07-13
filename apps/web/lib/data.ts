import { withResgCache } from "@/lib/resg-cache"
import { createDataContext } from "@/lib/context"

// 可用数据版本独立于 Data Dragon 的最新游戏版本
export const DATA_VERSION = process.env.RESG_DATA_VERSION ?? "16.13"
export const DATA_CONTEXT = createDataContext(DATA_VERSION)

const apiBase = "https://api.resg.top/api"
const cdragonBase = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/zh_cn/v1"

export interface ChampionRank {
  id: number
  name: string
  alias: string
  matches: number
  winRate: number
}

export interface AugmentRank {
  id: number
  name: string
  description: string
  matches: number
  winRate: number
}

type ChampionStat = { champion_id: number; total_matches: string; avg_win_rate: string }
type ChampionSummary = { id: number; name: string; alias: string }
type AugmentStat = {
  augment_id: number
  display_name: string
  description: string
  total_matches: string
  win_rate: string
}
type Combo = {
  combo_type?: string
  combo_key?: string
  tier_signature?: string
  spells?: number[]
  boots_id?: number | null
  max_order?: string
  total_matches: number
  win_rate: number
  builds?: { items: number[]; total_matches: number; win_rate: number }[]
}

const fallbackChampions: ChampionRank[] = [
  { id: 67, name: "薇恩", alias: "Vayne", matches: 34541, winRate: 0.5963 },
  { id: 14, name: "赛恩", alias: "Sion", matches: 30270, winRate: 0.5794 },
  { id: 104, name: "格雷福斯", alias: "Graves", matches: 33745, winRate: 0.5766 },
  { id: 876, name: "莉莉娅", alias: "Lillia", matches: 28311, winRate: 0.5724 },
  { id: 222, name: "金克丝", alias: "Jinx", matches: 27028, winRate: 0.5674 },
]

export const championIcon = (id: number) =>
  `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${id}.png`

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error(`上游接口请求失败：${response.status}`)
  return (await response.json()) as T
}

function valueOrNull<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === "fulfilled" ? result.value : null
}

export async function getChampions(version = DATA_VERSION): Promise<ChampionRank[]> {
  return withResgCache(`champions:global:aram:${version}`, 3600, async () => {
    const [statsResult, summaryResult] = await Promise.allSettled([
      request<ChampionStat[]>(`${apiBase}/champions/stats?version=${version}`),
      request<ChampionSummary[]>(`${cdragonBase}/champion-summary.json`),
    ])
    const stats = valueOrNull(statsResult)
    const summary = valueOrNull(summaryResult)
    if (!stats || !summary) return fallbackChampions
    const names = new Map(summary.map((champion) => [champion.id, champion]))
    return stats.flatMap((stat) => {
      const champion = names.get(stat.champion_id)
      return champion
        ? [
            {
              id: champion.id,
              name: champion.name,
              alias: champion.alias,
              matches: Number(stat.total_matches),
              winRate: Number(stat.avg_win_rate),
            },
          ]
        : []
    })
  })
}

export async function getAugments(version = DATA_VERSION): Promise<AugmentRank[]> {
  return withResgCache(`augments:global:aram:${version}`, 3600, async () => {
    let augments: AugmentStat[]
    try {
      augments = await request<AugmentStat[]>(`${apiBase}/augments/tier-list?version=${version}`)
    } catch {
      return []
    }

    return augments.map((augment) => ({
      id: augment.augment_id,
      name: augment.display_name,
      description: augment.description.replaceAll(/<[^>]+>/g, ""),
      matches: Number(augment.total_matches),
      winRate: Number(augment.win_rate),
    }))
  })
}

export async function getChampion(id: number) {
  const champions = await getChampions()
  return champions.find((champion) => champion.id === id) ?? null
}

export async function getAugment(id: number) {
  const augments = await getAugments()
  return augments.find((augment) => augment.id === id) ?? null
}

export async function getChampionCombos(id: number): Promise<Combo[]> {
  return withResgCache(`champion-combos:global:aram:${DATA_VERSION}:${id}`, 3600, async () => {
    let combos: Combo[]
    try {
      combos = (await request<{ combos: Combo[] }>(`${apiBase}/base-stats?championId=${id}&version=${DATA_VERSION}`))
        .combos
    } catch {
      return []
    }
    return combos.map((combo) =>
      Object.assign(combo, { total_matches: Number(combo.total_matches), win_rate: Number(combo.win_rate) })
    )
  })
}

export async function getChampionSynergy(id: number): Promise<Combo[]> {
  return withResgCache(`champion-synergy:global:aram:${DATA_VERSION}:${id}`, 3600, async () => {
    try {
      return await request<Combo[]>(`${apiBase}/synergy?championId=${id}&version=${DATA_VERSION}`)
    } catch {
      return []
    }
  })
}

export function percent(value: number) {
  return `${(value * 100).toFixed(2)}%`
}
export function number(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value)
}
export function confidence(matches: number) {
  return matches >= 5000 ? "高可信" : matches >= 1000 ? "中可信" : "样本有限"
}

const spells: Record<number, string> = {
  1: "净化",
  3: "虚弱",
  4: "闪现",
  6: "幽灵疾步",
  7: "治疗",
  12: "传送",
  21: "屏障",
  32: "雪球",
}
const boots: Record<number, string> = { 1001: "速度之靴", 3006: "狂战士胫甲", 3008: "明朗之靴", 3111: "水银之靴" }

export function comboLabel(combo: Combo) {
  const spellLabel = combo.spells?.map((spell) => spells[spell] ?? `召唤师技能 ${spell}`).join(" · ")
  const parts = [
    spellLabel,
    combo.boots_id ? (boots[combo.boots_id] ?? `鞋子 ${combo.boots_id}`) : undefined,
    combo.max_order ? `主${combo.max_order.replace("-", "副")}` : undefined,
  ].filter(Boolean)
  return parts.join(" ｜ ") || combo.combo_key || "组合信息缺失"
}
