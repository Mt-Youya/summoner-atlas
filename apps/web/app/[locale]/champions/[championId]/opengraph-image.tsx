import { ImageResponse } from "next/og"
import { getChampion, number, percent } from "@/lib/data"
import { translateChampionName } from "@summoner-atlas/i18n"

export const alt = "Summoner Atlas"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string; championId: string }> }) {
  const { locale, championId } = await params
  const champion = await getChampion(Number(championId))
  const name = champion ? translateChampionName(champion.name, locale) : "Champion data"
  const stats = champion ? `${percent(champion.winRate)} WR · ${number(champion.matches)} games` : "Current patch data"
  return new ImageResponse(
    <div tw="flex h-full w-full flex-col justify-between bg-slate-950 p-16 text-slate-100">
      <div tw="flex text-2xl text-cyan-300">SUMMONER ATLAS · Global sample / ARAM</div>
      <div tw="flex flex-col">
        <div tw="flex text-8xl font-bold">{name}</div>
        <div tw="flex pt-7 text-3xl text-slate-300">{stats}</div>
      </div>
      <div tw="flex text-xl text-slate-400">Patch 16.13 · Data conclusions require game context</div>
    </div>,
    size
  )
}
