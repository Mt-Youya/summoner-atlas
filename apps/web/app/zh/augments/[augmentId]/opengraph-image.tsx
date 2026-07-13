import { ImageResponse } from "next/og"
import { getAugment, number, percent } from "@/lib/data"

export const alt = "Summoner Atlas 海克斯数据"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpenGraphImage({ params }: { params: Promise<{ augmentId: string }> }) {
  const augment = await getAugment(Number((await params).augmentId))
  return new ImageResponse(
    <div tw="flex h-full w-full flex-col justify-between bg-slate-950 p-16 text-slate-100">
      <div tw="flex text-2xl text-cyan-300">SUMMONER ATLAS · 全球公开样本 / 大乱斗</div>
      <div tw="flex flex-col">
        <div tw="flex text-7xl font-bold">{augment?.name ?? "海克斯数据"}</div>
        <div tw="flex pt-7 text-3xl text-slate-300">
          {augment ? `${percent(augment.winRate)} 胜率 · ${number(augment.matches)} 场` : "当前版本数据"}
        </div>
      </div>
      <div tw="flex text-xl text-slate-400">版本 16.13 · 数据结论需结合实际对局判断</div>
    </div>,
    size
  )
}
