import { Suspense } from "react"
import type { Metadata } from "next"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { canonical } from "@/lib/site"
import { BuildsView } from "./builds-view"

export const metadata: Metadata = {
  title: "构筑研究",
  description: "选择英雄、模式与版本，研究最优构筑与出装方案。",
  alternates: { canonical: canonical("/zh/builds") },
}

export default function BuildsPage() {
  return (
    <PageFrame>
      <PageTitle eyebrow="构筑" title="构筑研究" description="选择英雄后查看当前版本下的最优构筑方案。" />
      <Suspense fallback={<p className="py-8 text-muted-foreground">正在加载…</p>}>
        <BuildsView />
      </Suspense>
    </PageFrame>
  )
}
