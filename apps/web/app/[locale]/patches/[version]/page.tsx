import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"
import { PatchDetailView } from "./patch-detail"

export default async function PatchDetailPage({ params }: { params: Promise<{ version: string }> }) {
  const { version } = await params
  const locale = await getLocale()
  if (!version) notFound()
  return (
    <PageFrame>
      <PageTitle eyebrow={t(locale, "patches")} title={`${t(locale, "version")} ${version}`} description="" />
      <PatchDetailView version={version} />
    </PageFrame>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ version: string }> }): Promise<Metadata> {
  const { version } = await params
  const locale = await getLocale()
  return {
    title: `${t(locale, "version")} ${version}`,
    description: `${t(locale, "version")} ${version} ${locale === "en" ? "patch notes and data changes" : locale === "ko" ? "패치 노트 및 데이터 변경사항" : "版本说明与数据变化"}`,
    alternates: { canonical: canonical(localizePath(`/zh/patches/${version}`, locale)) },
  }
}
