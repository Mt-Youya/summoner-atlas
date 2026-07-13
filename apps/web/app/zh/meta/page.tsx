import { Suspense } from "react"
import type { Metadata } from "next"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { canonical } from "@/lib/site"
import { MetaView } from "./meta-view"

export const metadata: Metadata = {
  title: "Meta",
  description: "当前版本英雄强度、构筑趋势与区域差异分析。",
  alternates: { canonical: canonical("/zh/meta") },
}

export default function MetaPage() {
  return (
    <PageFrame>
      <PageTitle eyebrow="Meta" title="版本格局" description="当前版本的英雄强度变化、构筑趋势与区域差异。" />
      <Suspense fallback={<p className="py-8 text-muted-foreground">正在加载…</p>}>
        <MetaView />
      </Suspense>
    </PageFrame>
  )
}
