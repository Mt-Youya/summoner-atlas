import { Suspense } from "react"
import type { Metadata } from "next"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { canonical } from "@/lib/site"
import { PatchesView } from "./patches-view"

export const metadata: Metadata = {
  title: "版本记录",
  description: "历史版本说明与数据更新时间线。",
  alternates: { canonical: canonical("/zh/patches") },
}

export default function PatchesPage() {
  return (
    <PageFrame>
      <PageTitle eyebrow="版本" title="版本记录" description="历史版本说明、数据更新时间线与版本间变化。" />
      <Suspense fallback={<p className="py-8 text-muted-foreground">正在加载…</p>}>
        <PatchesView />
      </Suspense>
    </PageFrame>
  )
}
