import { fetchCache, ok, notFound, serverError } from "../../supabase"

const CDRAGON = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default"

function summonerIcon(id: number) {
  const icons: Record<number, string> = {
    1: "Summoner_boost.png",
    3: "Summoner_exhaust.png",
    4: "Summoner_flash.png",
    6: "Summoner_haste.png",
    7: "Summoner_heal.png",
    11: "Summoner_smite.png",
    12: "Summoner_Teleport_New.png",
    13: "SummonerMana.png",
    14: "SummonerIgnite.png",
    21: "SummonerBarrier.png",
    32: "Summoner_Mark.png",
  }
  const file = icons[id] ?? `Summoner_${id}.png`
  return `${CDRAGON}/v1/summoner-spells/${file}`
}

function itemIcon(id: number) {
  return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${id}_class_t2.png`
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
    const spells = (combo.spells as number[]).map((sId) => ({
      id: sId,
      icon: summonerIcon(sId),
    }))
    const bootsId = combo.boots_id as number
    return {
      spells,
      boots: { id: bootsId, icon: itemIcon(bootsId) },
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
