import { PageFrame, PageTitle } from "@/components/page-frame"
import { RankingExplorer } from "@/components/ranking-explorer"
import { DATA_VERSION } from "@/lib/data"

export const metadata = {
  title: "海克斯榜 | summoner-atlas",
  description: "海克斯大乱斗海克斯胜率、场次与可信度排行。",
}

export default async function AugmentsPage() {
  return (
    <PageFrame>
      <PageTitle
        eyebrow={`海克斯榜 / ${DATA_VERSION}`}
        title="找出值得拿的海克斯"
        description="排序依据真实公开样本。低场次结论会明确标记，避免把偶然高胜率当成稳定方案。"
      />
      <Suspense fallback={<p className="py-8 text-muted-foreground">正在加载榜单控件…</p>}>
        <RankingExplorer type="augment" />
      </Suspense>
    </PageFrame>
  )
}
import { Suspense } from "react"
