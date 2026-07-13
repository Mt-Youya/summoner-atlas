import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageFrame } from "@/components/layout/page-frame"
import { PageTitle } from "@/components/layout/page-title"
import { getItem } from "@/lib/data"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"
import { ItemDetailView } from "./item-detail"

export default async function ItemDetailPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params
  const locale = await getLocale()
  const id = Number(itemId)
  if (Number.isNaN(id)) notFound()
  const item = await getItem(id)
  if (!item) notFound()
  return (
    <PageFrame>
      <PageTitle eyebrow={t(locale, "items")} title={item.name} description={item.description} />
      <ItemDetailView item={{ id: item.id, name: item.name, description: item.description }} />
    </PageFrame>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ itemId: string }> }): Promise<Metadata> {
  const { itemId } = await params
  const locale = await getLocale()
  const id = Number(itemId)
  if (Number.isNaN(id)) return { title: `${t(locale, "pageNotFound")} | Summoner Atlas` }
  const item = await getItem(id)
  if (!item) return { title: `${t(locale, "pageNotFound")} | Summoner Atlas` }
  return {
    title: `${item.name} - ${t(locale, "itemsDetail")}`,
    description: `${item.name} ${locale === "en" ? "detailed data" : locale === "ko" ? "상세 데이터" : "详细数据"}`,
    alternates: { canonical: canonical(localizePath(`/zh/items/${id}`, locale)) },
  }
}
