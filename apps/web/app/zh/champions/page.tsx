import { PageFrame, PageTitle } from "@/components/page-frame"
import { RankingExplorer } from "@/components/ranking-explorer"
import { DATA_VERSION } from "@/lib/data"

export const metadata = { title: "英雄榜 | summoner-atlas", description: "海克斯大乱斗英雄胜率、场次与可信度排行。" }

export default async function ChampionsPage() {
  return (
    <PageFrame>
      <PageTitle
        eyebrow={`英雄榜 / ${DATA_VERSION}`}
        title="用数据选英雄"
        description="支持名称、拼音和外号检索。排序与筛选写入 URL，可直接分享当前结果。"
      />
      <Suspense fallback={<p className="empty-state">正在加载榜单控件…</p>}>
        <RankingExplorer type="champion" />
      </Suspense>
    </PageFrame>
  )
}
import { Suspense } from "react"
