import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"
import { RuneDetailView } from "./rune-detail"

export default async function RuneDetailPage({ params }: { params: Promise<{ runeId: string }> }) {
  const { runeId } = await params
  const locale = await getLocale()
  const id = Number(runeId)
  if (Number.isNaN(id)) notFound()
  return (
    <PageFrame>
      <PageTitle eyebrow={t(locale, "runes")} title={t(locale, "runesDetail")} description="" />
      <RuneDetailView id={id} />
    </PageFrame>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ runeId: string }> }): Promise<Metadata> {
  const { runeId } = await params
  const locale = await getLocale()
  const id = Number(runeId)
  if (Number.isNaN(id)) return { title: `${t(locale, "pageNotFound")} | Summoner Atlas` }
  return {
    title: `${t(locale, "runesDetail")} | Summoner Atlas`,
    alternates: { canonical: canonical(localizePath(`/zh/runes/${id}`, locale)) },
  }
}
