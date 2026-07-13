import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { canonical } from "@/lib/site"
import { PatchDetailView } from "./patch-detail"

interface Props {
  params: Promise<{ version: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const version = (await params).version
  return {
    title: `版本 ${version}`,
    description: `版本 ${version} 的详细说明与数据变化。`,
    alternates: { canonical: canonical(`/zh/patches/${version}`) },
  }
}

export default async function PatchDetailPage({ params }: Props) {
  const version = (await params).version
  if (!version) notFound()
  return (
    <PageFrame>
      <PageTitle eyebrow="版本" title={`版本 ${version}`} description="" />
      <PatchDetailView version={version} />
    </PageFrame>
  )
}
