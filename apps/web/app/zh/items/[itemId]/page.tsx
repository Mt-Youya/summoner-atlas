import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { getItem } from "@/lib/data"
import { canonical } from "@/lib/site"
import { ItemDetailView } from "./item-detail"

interface Props {
  params: Promise<{ itemId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number((await params).itemId)
  if (Number.isNaN(id)) return { title: "装备未找到" }
  const item = await getItem(id)
  if (!item) return { title: "装备未找到" }
  return {
    title: `${item.name} - 装备详情`,
    description: `${item.name} 的详细数据`,
    alternates: { canonical: canonical(`/zh/items/${id}`) },
  }
}

export default async function ItemDetailPage({ params }: Props) {
  const id = Number((await params).itemId)
  if (Number.isNaN(id)) notFound()
  const item = await getItem(id)
  if (!item) notFound()
  return (
    <PageFrame>
      <PageTitle eyebrow="装备" title={item.name} description={item.description} />
      <ItemDetailView item={{ id: item.id, name: item.name, description: item.description }} />
    </PageFrame>
  )
}
