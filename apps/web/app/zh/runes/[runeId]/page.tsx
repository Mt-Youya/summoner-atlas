import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { canonical } from "@/lib/site"
import { RuneDetailView } from "./rune-detail"

interface Props {
  params: Promise<{ runeId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number((await params).runeId)
  if (Number.isNaN(id)) return { title: "符文未找到" }
  return {
    title: "符文详情",
    alternates: { canonical: canonical(`/zh/runes/${id}`) },
  }
}

export default async function RuneDetailPage({ params }: Props) {
  const id = Number((await params).runeId)
  if (Number.isNaN(id)) notFound()
  return (
    <PageFrame>
      <PageTitle eyebrow="符文" title="符文详情" description="" />
      <RuneDetailView id={id} />
    </PageFrame>
  )
}
