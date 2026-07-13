import { ImageResponse } from "next/og"
import { getAugment, number, percent } from "@/lib/data"

export const alt = "Summoner Atlas"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpenGraphImage({ params }: { params: Promise<{ augmentId: string }> }) {
  const augment = await getAugment(Number((await params).augmentId))
  const name = augment?.name ?? "Augment data"
  const stats = augment ? `${percent(augment.winRate)} WR · ${number(augment.matches)} games` : "Current patch data"
  return new ImageResponse(
    <div tw="flex h-full w-full flex-col justify-between bg-slate-950 p-16 text-slate-100">
      <div tw="flex text-2xl text-cyan-300">SUMMONER ATLAS · Global sample / ARAM</div>
      <div tw="flex flex-col">
        <div tw="flex text-7xl font-bold">{name}</div>
        <div tw="flex pt-7 text-3xl text-slate-300">{stats}</div>
      </div>
      <div tw="flex text-xl text-slate-400">Patch 16.13 · Data conclusions require game context</div>
    </div>,
    size
  )
}
