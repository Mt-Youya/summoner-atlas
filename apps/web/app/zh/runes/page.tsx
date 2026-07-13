import { Suspense } from "react"
import type { Metadata } from "next"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { canonical } from "@/lib/site"
import { RunesRanking } from "./runes-ranking"

export const metadata: Metadata = {
  title: "符文排行",
  description: "查看各模式下符文的胜率、登场率与高样本数据。",
  alternates: { canonical: canonical("/zh/runes") },
}

export default function RunesPage() {
  return (
    <PageFrame>
      <PageTitle eyebrow="符文" title="符文排行" description="基于当前版本的高样本符文胜率与登场率。" />
      <Suspense fallback={<p className="py-8 text-muted-foreground">正在加载…</p>}>
        <RunesRanking />
      </Suspense>
    </PageFrame>
  )
}
