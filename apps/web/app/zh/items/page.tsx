import { Suspense } from "react"
import type { Metadata } from "next"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { canonical } from "@/lib/site"
import { ItemsRanking } from "./items-ranking"

export const metadata: Metadata = {
  title: "装备排行",
  description: "查看各模式下装备的胜率、登场率与高样本数据。",
  alternates: { canonical: canonical("/zh/items") },
}

export default function ItemsPage() {
  return (
    <PageFrame>
      <PageTitle eyebrow="装备" title="装备排行" description="基于当前版本的高样本装备胜率与登场率。" />
      <Suspense fallback={<p className="py-8 text-muted-foreground">正在加载…</p>}>
        <ItemsRanking />
      </Suspense>
    </PageFrame>
  )
}
