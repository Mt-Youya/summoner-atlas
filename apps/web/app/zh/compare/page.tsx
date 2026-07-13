import Link from "next/link"
import { PageFrame, PageTitle } from "@/components/page-frame"

export const metadata = { title: "英雄对比 | summoner-atlas" }

export default function ComparePage() {
  return (
    <PageFrame>
      <PageTitle
        eyebrow="英雄对比"
        title="在同一版本比较选择"
        description="对比使用 URL 参数保存英雄和版本。选择两个英雄后，可从详情页的胜率、样本和组合数据快速核对差异。"
      />
      <div className="my-10 flex flex-wrap gap-3">
        <Link
          className="border border-black/30 px-4 py-3 text-sm hover:bg-[var(--award-lime)]"
          href="/zh/champions/67?compare=14"
        >
          薇恩与赛恩
        </Link>
        <Link className="border border-black/30 px-4 py-3 text-sm hover:bg-[var(--award-lime)]" href="/zh/champions">
          选择英雄
        </Link>
      </div>
    </PageFrame>
  )
}
