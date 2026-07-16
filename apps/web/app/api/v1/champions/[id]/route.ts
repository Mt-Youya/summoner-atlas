import { fetchCache, ok, notFound, serverError } from "../../supabase"

const DATA_DRAGON_VERSION = "16.13.1"

const boots = {
  1001: { name: "Boots", nameZh: "鞋子" },
  3006: { name: "Berserker's Greaves", nameZh: "狂战士胫甲" },
  3008: { name: "Gluttonous Greaves", nameZh: "暴食胫甲" },
  3009: { name: "Boots of Swiftness", nameZh: "轻灵之靴" },
  3020: { name: "Sorcerer's Shoes", nameZh: "法师之靴" },
  3047: { name: "Plated Steelcaps", nameZh: "铁板靴" },
  3111: { name: "Mercury's Treads", nameZh: "水银之靴" },
  3158: { name: "Ionian Boots of Lucidity", nameZh: "明朗之靴" },
} as const

function bootDetails(id: number) {
  return boots[id as keyof typeof boots] ?? { name: `Item ${id}`, nameZh: `装备 ${id}` }
}

function itemIcon(id: number) {
  return `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/img/item/${id}.png`
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Resolve string ID -> numeric ID via champions cache
  const champions = (await fetchCache("v2:champions:global:aram:16.13")) as Record<string, unknown>[] | null
  if (!champions) return serverError()

  // Find champion by alias or numeric id
  const champ = champions.find((c) => String(c.alias).toLowerCase() === id.toLowerCase() || String(c.id) === id)
  if (!champ) return notFound()

  const numericId = champ.id as number

  // Fetch build combos
  const comboKey = `v2:champion-combos:global:aram:16.13:${numericId}`
  const comboData = (await fetchCache(comboKey)) as Record<string, unknown>[] | null

  const builds = (comboData ?? []).map((combo: Record<string, unknown>) => {
    const bootsId = combo.boots_id as number
    return {
      boots: { id: bootsId, ...bootDetails(bootsId), icon: itemIcon(bootsId) },
      skillOrder: (combo.max_order as string) ?? "",
      winRate: (combo.win_rate as number) * 100,
      matches: combo.total_matches as number,
    }
  })

  return ok(
    {
      id: champ.alias,
      numericId,
      name: champ.alias,
      nameZh: champ.name,
      imageUrl: champ.imageUrl,
      winRate: (champ.winRate as number) * 100,
      matches: champ.matches,
      builds,
    },
    { version: "16.13" }
  )
}
